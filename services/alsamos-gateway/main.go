package main

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math/big"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type ctxKey string

const claimsKey ctxKey = "claims"

type app struct {
	log             *slog.Logger
	issuers         []*issuer
	routes          map[string]*url.URL
	limiter         *redisLimiter
	requests        *prometheus.CounterVec
	latency         *prometheus.HistogramVec
	limitEach       int
	resendKey       string
	resendFrom      string
	supabaseURL     string
	supabaseAnonKey string
	inboundSecret   string
	minioAccessKey  string
	minioSecretKey  string
	minioRegion     string
	mediaBucket     string
	mediaEndpoint   string
	mediaBaseURL    string
	maxUploadBytes  int64
}

type issuer struct {
	name   string
	iss    string
	jwks   string
	secret string

	mu      sync.RWMutex
	keys    map[string]any
	expires time.Time
}

type claims struct {
	Sub   string
	Email string
	Iss   string
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	a := &app{
		log: logger,
		routes: map[string]*url.URL{
			"/api/social/":   mustURL(env("SOCIAL_URL", "http://social-web.apps.svc.cluster.local")),
			"/api/mail/":     mustURL(env("MAIL_URL", "http://mail-web.apps.svc.cluster.local")),
			"/api/accounts/": mustURL(env("ACCOUNTS_URL", "http://accounts-web.apps.svc.cluster.local")),
			"/ai/":           mustURL(env("AI_URL", "http://ai-gateway.apps.svc.cluster.local:8000")),
		},
		limiter:         newRedisLimiter(env("REDIS_ADDR", "redis.data.svc.cluster.local:6379"), env("REDIS_PASSWORD", "")),
		limitEach:       envInt("RATE_LIMIT_PER_MINUTE", 100),
		resendKey:       os.Getenv("RESEND_API_KEY"),
		resendFrom:      env("RESEND_FROM", "Alsamos <no-reply@alsamos.com>"),
		supabaseURL:     strings.TrimRight(env("SUPABASE_URL", "https://mbhjganbihamoiqmankv.supabase.co"), "/"),
		supabaseAnonKey: os.Getenv("SUPABASE_PUBLISHABLE_KEY"),
		inboundSecret:   os.Getenv("INBOUND_SHARED_SECRET"),
		minioAccessKey:  os.Getenv("MINIO_ACCESS_KEY"),
		minioSecretKey:  os.Getenv("MINIO_SECRET_KEY"),
		minioRegion:     env("MINIO_REGION", "us-east-1"),
		mediaBucket:     env("MEDIA_BUCKET", "media"),
		mediaEndpoint:   strings.TrimRight(env("MEDIA_ENDPOINT", "https://media.alsamos.com"), "/"),
		mediaBaseURL:    strings.TrimRight(env("MEDIA_BASE_URL", "https://media.alsamos.com/media"), "/"),
		maxUploadBytes:  int64(envInt("MEDIA_MAX_UPLOAD_MB", 50)) * 1024 * 1024,
		requests: prometheus.NewCounterVec(prometheus.CounterOpts{
			Name: "alsamos_gateway_requests_total",
			Help: "Total gateway requests.",
		}, []string{"path", "status"}),
		latency: prometheus.NewHistogramVec(prometheus.HistogramOpts{
			Name:    "alsamos_gateway_request_duration_seconds",
			Help:    "Gateway request latency.",
			Buckets: prometheus.DefBuckets,
		}, []string{"path"}),
	}
	a.issuers = []*issuer{
		{name: "alsamos-id", iss: env("ALSAMOS_ID_ISSUER", "https://id.alsamos.com"), jwks: env("ALSAMOS_ID_JWKS_URL", "https://id.alsamos.com/jwks.json")},
		{name: "supabase", iss: env("SUPABASE_ISSUER", "https://mbhjganbihamoiqmankv.supabase.co/auth/v1"), jwks: env("SUPABASE_JWKS_URL", "https://mbhjganbihamoiqmankv.supabase.co/auth/v1/.well-known/jwks.json"), secret: os.Getenv("SUPABASE_JWT_SECRET")},
	}
	prometheus.MustRegister(a.requests, a.latency)

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("/readyz", a.ready)
	mux.Handle("/metrics", promhttp.Handler())
	mux.HandleFunc("/api/mail/send", a.sendMail)
	mux.HandleFunc("/api/mail/inbound", a.receiveInboundMail)
	mux.HandleFunc("/api/media/presign", a.presignMediaUpload)
	mux.HandleFunc("/api/media/sign", a.signPrivateMedia)
	mux.HandleFunc("/", a.gateway)

	srv := &http.Server{Addr: ":8080", Handler: a.observe(a.cors(mux)), ReadHeaderTimeout: 10 * time.Second}
	logger.Info("alsamos-gateway listening", "addr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		logger.Error("server stopped", "error", err)
		os.Exit(1)
	}
}

func (a *app) ready(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 2*time.Second)
	defer cancel()
	if err := a.limiter.ping(ctx); err != nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "redis_unavailable"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ready"})
}

func (a *app) cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigin(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "authorization,apikey,content-type,x-client-info,prefer")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func allowedOrigin(origin string) bool {
	if origin == "" {
		return false
	}
	u, err := url.Parse(origin)
	if err != nil || u.Scheme != "https" {
		return false
	}
	host := strings.ToLower(u.Hostname())
	return host == "alsamos.com" || strings.HasSuffix(host, ".alsamos.com")
}

func (a *app) gateway(w http.ResponseWriter, r *http.Request) {
	target, prefix := a.route(r.URL.Path)
	if target == nil {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not_found"})
		return
	}

	c, err := a.authenticate(r)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_token"})
		return
	}
	ip := clientIP(r)
	if !a.allow(r.Context(), "ip:"+ip) || !a.allow(r.Context(), "user:"+c.Sub) {
		writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "rate_limited"})
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	original := proxy.Director
	proxy.Director = func(req *http.Request) {
		original(req)
		req.URL.Path = "/" + strings.TrimPrefix(strings.TrimPrefix(r.URL.Path, prefix), "/")
		if req.URL.Path == "/" && strings.HasSuffix(r.URL.Path, "/") {
			req.URL.RawPath = ""
		}
		req.Host = target.Host
		req.Header.Set("X-Alsamos-Subject", c.Sub)
		req.Header.Set("X-Alsamos-Email", c.Email)
		req.Header.Set("X-Forwarded-Prefix", strings.TrimSuffix(prefix, "/"))
	}
	proxy.ErrorHandler = func(w http.ResponseWriter, req *http.Request, err error) {
		a.log.Warn("proxy_error", "path", req.URL.Path, "error", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "bad_gateway"})
	}
	proxy.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), claimsKey, c)))
}

func (a *app) route(path string) (*url.URL, string) {
	for prefix, target := range a.routes {
		if strings.HasPrefix(path, prefix) {
			return target, prefix
		}
	}
	return nil, ""
}

func (a *app) authenticate(r *http.Request) (claims, error) {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return claims{}, errors.New("missing bearer")
	}
	raw := strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
	var last error
	for _, is := range a.issuers {
		c, err := is.validate(r.Context(), raw)
		if err == nil {
			return c, nil
		}
		last = err
	}
	if c, err := a.supabaseUser(r.Context(), raw); err == nil {
		return c, nil
	}
	return claims{}, last
}

func (a *app) sendMail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}
	if a.resendKey == "" {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "resend_not_configured"})
		return
	}
	c, err := a.authenticate(r)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_token"})
		return
	}
	rawToken := bearerToken(r)
	ip := clientIP(r)
	if !a.allow(r.Context(), "ip:"+ip) || !a.allow(r.Context(), "user:"+c.Sub) {
		writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "rate_limited"})
		return
	}

	var in struct {
		To      []mailRecipient `json:"to"`
		CC      []mailRecipient `json:"cc"`
		Subject string          `json:"subject"`
		HTML    string          `json:"html"`
		Text    string          `json:"text"`
	}
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&in); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}
	to := cleanRecipients(in.To)
	cc := cleanRecipients(in.CC)
	if len(to) == 0 || strings.TrimSpace(in.Subject) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "to_and_subject_required"})
		return
	}
	sender, err := a.senderIdentity(r.Context(), rawToken, c.Sub)
	if err != nil {
		a.log.Warn("sender_identity_failed", "user", c.Sub, "error", err)
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "sender_alias_not_configured"})
		return
	}
	payload := map[string]any{
		"from":     sender.Formatted,
		"reply_to": sender.Email,
		"to":       to,
		"subject":  strings.TrimSpace(in.Subject),
	}
	if len(cc) > 0 {
		payload["cc"] = cc
	}
	if strings.TrimSpace(in.HTML) != "" {
		payload["html"] = in.HTML
	}
	if strings.TrimSpace(in.Text) != "" {
		payload["text"] = in.Text
	}
	if payload["html"] == nil && payload["text"] == nil {
		payload["text"] = " "
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequestWithContext(r.Context(), http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	req.Header.Set("Authorization", "Bearer "+a.resendKey)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		a.log.Warn("resend_send_failed", "error", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "resend_unreachable"})
		return
	}
	defer res.Body.Close()
	var out map[string]any
	_ = json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&out)
	if res.StatusCode/100 != 2 {
		a.log.Warn("resend_rejected", "status", res.StatusCode, "body", out)
		writeJSON(w, http.StatusBadGateway, map[string]any{"error": "resend_rejected", "status": res.StatusCode})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"status":   "accepted",
		"provider": "resend",
		"id":       out["id"],
		"sender": map[string]string{
			"name":  sender.Name,
			"email": sender.Email,
		},
	})
}

type senderIdentity struct {
	Name      string
	Email     string
	Formatted string
}

func (a *app) senderIdentity(ctx context.Context, rawToken, userID string) (senderIdentity, error) {
	if a.supabaseURL == "" || a.supabaseAnonKey == "" || rawToken == "" || userID == "" {
		return senderIdentity{}, errors.New("sender_lookup_not_configured")
	}
	alias, err := a.lookupMailboxAlias(ctx, rawToken, userID)
	if err != nil {
		return senderIdentity{}, err
	}
	alias = strings.TrimSpace(strings.TrimPrefix(alias, "@"))
	if alias == "" || strings.Contains(alias, "@") {
		return senderIdentity{}, errors.New("invalid_alias")
	}
	name := strings.TrimSpace(a.lookupDisplayName(ctx, rawToken, userID))
	if name == "" {
		name = alias
	}
	email := alias + "@alsamos.com"
	return senderIdentity{
		Name:      name,
		Email:     email,
		Formatted: fmt.Sprintf("%s <%s>", sanitizeMailName(name), email),
	}, nil
}

func (a *app) lookupMailboxAlias(ctx context.Context, rawToken, userID string) (string, error) {
	endpoint := a.supabaseURL + "/rest/v1/mailbox_aliases?select=alias&user_id=eq." + url.QueryEscape(userID) + "&limit=1"
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	a.setSupabaseUserHeaders(req, rawToken)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	if res.StatusCode/100 != 2 {
		out, _ := io.ReadAll(io.LimitReader(res.Body, 1<<20))
		return "", fmt.Errorf("mailbox_aliases status %d: %s", res.StatusCode, strings.TrimSpace(string(out)))
	}
	var rows []struct {
		Alias string `json:"alias"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&rows); err != nil {
		return "", err
	}
	if len(rows) == 0 || strings.TrimSpace(rows[0].Alias) == "" {
		return "", errors.New("missing_mailbox_alias")
	}
	return rows[0].Alias, nil
}

func (a *app) lookupDisplayName(ctx context.Context, rawToken, userID string) string {
	endpoint := a.supabaseURL + "/rest/v1/profiles?select=display_name&user_id=eq." + url.QueryEscape(userID) + "&limit=1"
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	a.setSupabaseUserHeaders(req, rawToken)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return ""
	}
	defer res.Body.Close()
	if res.StatusCode/100 != 2 {
		return ""
	}
	var rows []struct {
		DisplayName string `json:"display_name"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&rows); err != nil || len(rows) == 0 {
		return ""
	}
	return rows[0].DisplayName
}

func (a *app) setSupabaseUserHeaders(req *http.Request, rawToken string) {
	req.Header.Set("apikey", a.supabaseAnonKey)
	req.Header.Set("Authorization", "Bearer "+rawToken)
	req.Header.Set("Accept", "application/json")
}

func (a *app) receiveInboundMail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}
	if a.inboundSecret == "" || a.supabaseAnonKey == "" {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "inbound_not_configured"})
		return
	}
	if r.Header.Get("X-Alsamos-Inbound-Secret") != a.inboundSecret {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_inbound_secret"})
		return
	}

	var in inboundMailRequest
	if err := json.NewDecoder(io.LimitReader(r.Body, 2<<20)).Decode(&in); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}
	if strings.TrimSpace(in.To) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "to_required"})
		return
	}
	if strings.TrimSpace(in.MessageID) == "" {
		in.MessageID = in.RawMessageID
	}
	id, err := a.insertInboundEmail(r.Context(), in)
	if err != nil {
		a.log.Warn("inbound_insert_failed", "error", err)
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": "supabase_insert_failed"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"status": "inserted", "id": id})
}

type inboundMailRequest struct {
	To           string `json:"to"`
	FromName     string `json:"from_name"`
	FromEmail    string `json:"from_email"`
	Subject      string `json:"subject"`
	HTML         string `json:"html"`
	Text         string `json:"text"`
	MessageID    string `json:"message_id"`
	RawMessageID string `json:"raw_message_id"`
}

func (a *app) insertInboundEmail(ctx context.Context, in inboundMailRequest) (string, error) {
	payload := map[string]string{
		"p_secret":     a.inboundSecret,
		"p_to":         strings.TrimSpace(in.To),
		"p_from_name":  strings.TrimSpace(in.FromName),
		"p_from_email": strings.TrimSpace(in.FromEmail),
		"p_subject":    strings.TrimSpace(in.Subject),
		"p_body_html":  in.HTML,
		"p_body_text":  in.Text,
		"p_message_id": strings.TrimSpace(in.MessageID),
	}
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequestWithContext(ctx, http.MethodPost, a.supabaseURL+"/rest/v1/rpc/insert_inbound_email", bytes.NewReader(body))
	req.Header.Set("apikey", a.supabaseAnonKey)
	req.Header.Set("Authorization", "Bearer "+a.supabaseAnonKey)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	out, _ := io.ReadAll(io.LimitReader(res.Body, 1<<20))
	if res.StatusCode/100 != 2 {
		return "", fmt.Errorf("rpc status %d: %s", res.StatusCode, strings.TrimSpace(string(out)))
	}
	var id string
	if err := json.Unmarshal(out, &id); err == nil && id != "" {
		return id, nil
	}
	var doc map[string]any
	if err := json.Unmarshal(out, &doc); err == nil {
		if v, ok := doc["insert_inbound_email"].(string); ok {
			return v, nil
		}
	}
	return strings.Trim(string(out), "\" \n\t"), nil
}

type mailRecipient struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func cleanRecipients(in []mailRecipient) []string {
	out := make([]string, 0, len(in))
	for _, r := range in {
		email := strings.TrimSpace(r.Email)
		if email == "" || !strings.Contains(email, "@") {
			continue
		}
		name := strings.TrimSpace(r.Name)
		if name != "" {
			name = strings.ReplaceAll(name, "\"", "")
			out = append(out, fmt.Sprintf("%s <%s>", name, email))
		} else {
			out = append(out, email)
		}
	}
	return out
}

func bearerToken(r *http.Request) string {
	auth := r.Header.Get("Authorization")
	if !strings.HasPrefix(auth, "Bearer ") {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(auth, "Bearer "))
}

func sanitizeMailName(name string) string {
	name = strings.TrimSpace(name)
	name = strings.ReplaceAll(name, "\r", " ")
	name = strings.ReplaceAll(name, "\n", " ")
	name = strings.ReplaceAll(name, "\"", "")
	if name == "" {
		return "Alsamos"
	}
	return name
}

func (a *app) presignMediaUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}
	if !a.mediaConfigured() {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "media_storage_not_configured"})
		return
	}
	c, err := a.authenticate(r)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_token"})
		return
	}
	ip := clientIP(r)
	if !a.allow(r.Context(), "ip:"+ip) || !a.allow(r.Context(), "user:"+c.Sub) {
		writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "rate_limited"})
		return
	}

	var in struct {
		Filename    string `json:"filename"`
		ContentType string `json:"content_type"`
		Size        int64  `json:"size"`
		Type        string `json:"type"`
		Visibility  string `json:"visibility"`
	}
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&in); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_json"})
		return
	}
	if in.Size <= 0 || in.Size > a.maxUploadBytes {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "file_too_large", "max_bytes": a.maxUploadBytes})
		return
	}
	contentType := strings.ToLower(strings.TrimSpace(in.ContentType))
	if !allowedMediaType(contentType) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "unsupported_content_type"})
		return
	}
	kind := mediaKind(in.Type, contentType)
	visibility := strings.ToLower(strings.TrimSpace(in.Visibility))
	if visibility == "" {
		visibility = "public"
	}
	if visibility != "public" && visibility != "private" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_visibility"})
		return
	}
	key := mediaObjectKey(kind, c.Sub, in.Filename, contentType)
	if visibility == "private" {
		key = "private/" + key
	}
	uploadURL, err := a.presignedS3URL(http.MethodPut, a.mediaBucket, key, 15*time.Minute)
	if err != nil {
		a.log.Warn("media_presign_failed", "error", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "presign_failed"})
		return
	}
	out := map[string]any{
		"upload_url": uploadURL,
		"method":     http.MethodPut,
		"bucket":     a.mediaBucket,
		"key":        key,
		"visibility": visibility,
		"headers": map[string]string{
			"Content-Type":  contentType,
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	}
	if visibility == "public" {
		out["public_url"] = a.mediaBaseURL + "/" + s3EscapePath(key)
	}
	writeJSON(w, http.StatusOK, out)
}

func (a *app) signPrivateMedia(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method_not_allowed"})
		return
	}
	if !a.mediaConfigured() {
		writeJSON(w, http.StatusServiceUnavailable, map[string]string{"error": "media_storage_not_configured"})
		return
	}
	if _, err := a.authenticate(r); err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_token"})
		return
	}
	key := strings.TrimSpace(r.URL.Query().Get("key"))
	if key == "" || strings.Contains(key, "..") || strings.HasPrefix(key, "/") {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid_key"})
		return
	}
	if !strings.HasPrefix(key, "private/") {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": "not_private_media"})
		return
	}
	signedURL, err := a.presignedS3URL(http.MethodGet, a.mediaBucket, key, 10*time.Minute)
	if err != nil {
		a.log.Warn("media_private_sign_failed", "error", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "sign_failed"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"url":        signedURL,
		"expires_in": 600,
	})
}

func (a *app) mediaConfigured() bool {
	return a.minioAccessKey != "" && a.minioSecretKey != "" && a.mediaEndpoint != "" && a.mediaBucket != ""
}

func allowedMediaType(contentType string) bool {
	if contentType == "" {
		return false
	}
	if strings.HasPrefix(contentType, "image/") || strings.HasPrefix(contentType, "video/") || strings.HasPrefix(contentType, "audio/") {
		return true
	}
	switch contentType {
	case "application/pdf", "text/plain", "text/csv", "application/zip", "application/json",
		"application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
		return true
	default:
		return false
	}
}

func mediaKind(requested, contentType string) string {
	requested = strings.ToLower(strings.TrimSpace(requested))
	switch requested {
	case "avatar", "post", "chat", "mail", "story", "product", "miniapp", "verification":
		return requested
	}
	switch {
	case strings.HasPrefix(contentType, "image/"):
		return "image"
	case strings.HasPrefix(contentType, "video/"):
		return "video"
	case strings.HasPrefix(contentType, "audio/"):
		return "audio"
	default:
		return "file"
	}
}

func mediaObjectKey(kind, userID, filename, contentType string) string {
	ext := strings.ToLower(path.Ext(strings.TrimSpace(filename)))
	if ext == "" {
		ext = extensionForContentType(contentType)
	}
	if ext == "" || len(ext) > 12 {
		ext = ".bin"
	}
	id := randomObjectID()
	return path.Join(kind, userID, id+ext)
}

func extensionForContentType(contentType string) string {
	switch strings.ToLower(contentType) {
	case "image/jpeg":
		return ".jpg"
	case "image/png":
		return ".png"
	case "image/webp":
		return ".webp"
	case "image/gif":
		return ".gif"
	case "video/mp4":
		return ".mp4"
	case "audio/mpeg":
		return ".mp3"
	case "audio/webm":
		return ".webm"
	case "application/pdf":
		return ".pdf"
	default:
		return ""
	}
}

func randomObjectID() string {
	var b [16]byte
	if _, err := rand.Read(b[:]); err == nil {
		return hex.EncodeToString(b[:])
	}
	sum := sha256.Sum256([]byte(strconv.FormatInt(time.Now().UnixNano(), 10)))
	return hex.EncodeToString(sum[:16])
}

func (a *app) presignedS3URL(method, bucket, key string, expires time.Duration) (string, error) {
	base, err := url.Parse(a.mediaEndpoint)
	if err != nil {
		return "", err
	}
	now := time.Now().UTC()
	amzDate := now.Format("20060102T150405Z")
	shortDate := now.Format("20060102")
	credentialScope := shortDate + "/" + a.minioRegion + "/s3/aws4_request"
	objectPath := "/" + bucket + "/" + s3EscapePath(key)
	q := url.Values{}
	q.Set("X-Amz-Algorithm", "AWS4-HMAC-SHA256")
	q.Set("X-Amz-Credential", a.minioAccessKey+"/"+credentialScope)
	q.Set("X-Amz-Date", amzDate)
	q.Set("X-Amz-Expires", strconv.Itoa(int(expires.Seconds())))
	q.Set("X-Amz-SignedHeaders", "host")
	canonicalQuery := canonicalQueryString(q)
	canonicalHeaders := "host:" + strings.ToLower(base.Host) + "\n"
	canonicalRequest := strings.Join([]string{
		method,
		objectPath,
		canonicalQuery,
		canonicalHeaders,
		"host",
		"UNSIGNED-PAYLOAD",
	}, "\n")
	hash := sha256.Sum256([]byte(canonicalRequest))
	stringToSign := strings.Join([]string{
		"AWS4-HMAC-SHA256",
		amzDate,
		credentialScope,
		hex.EncodeToString(hash[:]),
	}, "\n")
	signature := hex.EncodeToString(hmacSHA256(signingKey(a.minioSecretKey, shortDate, a.minioRegion), []byte(stringToSign)))
	q.Set("X-Amz-Signature", signature)
	base.Path = objectPath
	base.RawQuery = canonicalQueryString(q)
	return base.String(), nil
}

func s3EscapePath(key string) string {
	parts := strings.Split(key, "/")
	for i, p := range parts {
		parts[i] = url.PathEscape(p)
	}
	return strings.Join(parts, "/")
}

func canonicalQueryString(v url.Values) string {
	return v.Encode()
}

func signingKey(secret, date, region string) []byte {
	kDate := hmacSHA256([]byte("AWS4"+secret), []byte(date))
	kRegion := hmacSHA256(kDate, []byte(region))
	kService := hmacSHA256(kRegion, []byte("s3"))
	return hmacSHA256(kService, []byte("aws4_request"))
}

func hmacSHA256(key, data []byte) []byte {
	mac := hmac.New(sha256.New, key)
	_, _ = mac.Write(data)
	return mac.Sum(nil)
}

func (a *app) supabaseUser(ctx context.Context, raw string) (claims, error) {
	if a.supabaseAnonKey == "" || a.supabaseURL == "" {
		return claims{}, errors.New("supabase_fallback_disabled")
	}
	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, a.supabaseURL+"/auth/v1/user", nil)
	req.Header.Set("Authorization", "Bearer "+raw)
	req.Header.Set("apikey", a.supabaseAnonKey)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return claims{}, err
	}
	defer res.Body.Close()
	if res.StatusCode/100 != 2 {
		return claims{}, fmt.Errorf("supabase user status %d", res.StatusCode)
	}
	var u struct {
		ID    string `json:"id"`
		Email string `json:"email"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&u); err != nil {
		return claims{}, err
	}
	if u.ID == "" {
		return claims{}, errors.New("missing supabase user id")
	}
	return claims{Sub: u.ID, Email: u.Email, Iss: a.supabaseURL + "/auth/v1"}, nil
}

func (is *issuer) validate(ctx context.Context, raw string) (claims, error) {
	parser := jwt.NewParser(jwt.WithIssuer(is.iss), jwt.WithExpirationRequired())
	tok, err := parser.Parse(raw, func(t *jwt.Token) (any, error) {
		if t.Method == jwt.SigningMethodHS256 && is.secret != "" {
			return []byte(is.secret), nil
		}
		if _, ok := t.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unsupported alg %s", t.Method.Alg())
		}
		kid, _ := t.Header["kid"].(string)
		keys, err := is.getKeys(ctx)
		if err != nil {
			return nil, err
		}
		if kid != "" {
			if k := keys[kid]; k != nil {
				return k, nil
			}
		}
		for _, k := range keys {
			return k, nil
		}
		return nil, errors.New("no jwk")
	})
	if err != nil || tok == nil || !tok.Valid {
		return claims{}, err
	}
	m, ok := tok.Claims.(jwt.MapClaims)
	if !ok {
		return claims{}, errors.New("claims")
	}
	sub, _ := m["sub"].(string)
	email, _ := m["email"].(string)
	iss, _ := m["iss"].(string)
	if sub == "" {
		return claims{}, errors.New("missing sub")
	}
	return claims{Sub: sub, Email: email, Iss: iss}, nil
}

func (is *issuer) getKeys(ctx context.Context) (map[string]any, error) {
	is.mu.RLock()
	if time.Now().Before(is.expires) && len(is.keys) > 0 {
		defer is.mu.RUnlock()
		return is.keys, nil
	}
	is.mu.RUnlock()

	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, is.jwks, nil)
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	if res.StatusCode/100 != 2 {
		return nil, fmt.Errorf("jwks status %d", res.StatusCode)
	}
	var doc struct {
		Keys []struct {
			Kid string `json:"kid"`
			Kty string `json:"kty"`
			Alg string `json:"alg"`
			N   string `json:"n"`
			E   string `json:"e"`
		} `json:"keys"`
	}
	if err := json.NewDecoder(io.LimitReader(res.Body, 1<<20)).Decode(&doc); err != nil {
		return nil, err
	}
	keys := map[string]any{}
	for _, k := range doc.Keys {
		if k.Kty != "RSA" {
			continue
		}
		pub, err := rsaPublic(k.N, k.E)
		if err == nil {
			keys[k.Kid] = pub
		}
	}
	is.mu.Lock()
	is.keys = keys
	is.expires = time.Now().Add(10 * time.Minute)
	is.mu.Unlock()
	return keys, nil
}

func rsaPublic(nRaw, eRaw string) (*rsa.PublicKey, error) {
	nb, err := base64.RawURLEncoding.DecodeString(nRaw)
	if err != nil {
		return nil, err
	}
	eb, err := base64.RawURLEncoding.DecodeString(eRaw)
	if err != nil {
		return nil, err
	}
	e := 0
	for _, b := range eb {
		e = e<<8 + int(b)
	}
	return &rsa.PublicKey{N: new(big.Int).SetBytes(nb), E: e}, nil
}

func (a *app) allow(ctx context.Context, key string) bool {
	ok, err := a.limiter.allow(ctx, "gw:"+key, a.limitEach, time.Minute)
	if err != nil {
		a.log.Warn("rate_limit_open", "key", key, "error", err)
		return true
	}
	return ok
}

func (a *app) observe(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		path := routeLabel(r.URL.Path)
		a.requests.WithLabelValues(path, strconv.Itoa(rec.status)).Inc()
		a.latency.WithLabelValues(path).Observe(time.Since(start).Seconds())
		a.log.Info("request", "method", r.Method, "path", r.URL.Path, "status", rec.status, "ms", time.Since(start).Milliseconds(), "ip", clientIP(r))
	})
}

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(status int) {
	r.status = status
	r.ResponseWriter.WriteHeader(status)
}

type redisLimiter struct {
	addr     string
	password string
}

func newRedisLimiter(addr, password string) *redisLimiter {
	return &redisLimiter{addr: addr, password: password}
}

func (r *redisLimiter) ping(ctx context.Context) error {
	_, err := r.command(ctx, "PING")
	return err
}

func (r *redisLimiter) allow(ctx context.Context, key string, limit int, window time.Duration) (bool, error) {
	now := time.Now().Unix()
	bucket := fmt.Sprintf("%s:%d", key, now/int64(window.Seconds()))
	out, err := r.command(ctx, "INCR", bucket)
	if err != nil {
		return false, err
	}
	count, _ := strconv.Atoi(strings.TrimSpace(out))
	if count == 1 {
		_, _ = r.command(ctx, "EXPIRE", bucket, strconv.Itoa(int(window.Seconds())+2))
	}
	return count <= limit, nil
}

func (r *redisLimiter) command(ctx context.Context, args ...string) (string, error) {
	d := net.Dialer{Timeout: 2 * time.Second}
	conn, err := d.DialContext(ctx, "tcp", r.addr)
	if err != nil {
		return "", err
	}
	defer conn.Close()
	_ = conn.SetDeadline(time.Now().Add(3 * time.Second))
	if r.password != "" {
		if _, err := writeRESP(conn, "AUTH", r.password); err != nil {
			return "", err
		}
		if _, err := readRESP(conn); err != nil {
			return "", err
		}
	}
	if _, err := writeRESP(conn, args...); err != nil {
		return "", err
	}
	return readRESP(conn)
}

func writeRESP(w io.Writer, args ...string) (int, error) {
	var b strings.Builder
	fmt.Fprintf(&b, "*%d\r\n", len(args))
	for _, a := range args {
		fmt.Fprintf(&b, "$%d\r\n%s\r\n", len(a), a)
	}
	return io.WriteString(w, b.String())
}

func readRESP(r io.Reader) (string, error) {
	var first [1]byte
	if _, err := io.ReadFull(r, first[:]); err != nil {
		return "", err
	}
	line, err := readLine(r)
	if err != nil {
		return "", err
	}
	switch first[0] {
	case '+', ':':
		return line, nil
	case '-':
		return "", errors.New(line)
	case '$':
		n, _ := strconv.Atoi(line)
		if n < 0 {
			return "", nil
		}
		buf := make([]byte, n+2)
		_, err := io.ReadFull(r, buf)
		return string(buf[:n]), err
	default:
		return "", fmt.Errorf("unexpected redis response %q", first[0])
	}
}

func readLine(r io.Reader) (string, error) {
	var b strings.Builder
	buf := make([]byte, 1)
	for {
		if _, err := io.ReadFull(r, buf); err != nil {
			return "", err
		}
		if buf[0] == '\r' {
			_, err := io.ReadFull(r, buf)
			return b.String(), err
		}
		b.WriteByte(buf[0])
	}
}

func routeLabel(path string) string {
	for _, p := range []string{"/api/mail/inbound", "/api/mail/send", "/api/social/", "/api/mail/", "/api/accounts/", "/ai/"} {
		if strings.HasPrefix(path, p) {
			return strings.TrimSuffix(p, "/")
		}
	}
	return path
}

func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		return strings.TrimSpace(strings.Split(xff, ",")[0])
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func mustURL(s string) *url.URL {
	u, err := url.Parse(s)
	if err != nil {
		panic(err)
	}
	return u
}

func env(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}

func envInt(key string, fallback int) int {
	v, err := strconv.Atoi(os.Getenv(key))
	if err != nil || v <= 0 {
		return fallback
	}
	return v
}
