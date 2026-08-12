package main

import (
	"context"
	"crypto/rsa"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"encoding/pem"
	"errors"
	"log"
	"math/big"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"crypto/x509"
)

type app struct {
	db      *sql.DB
	priv    *rsa.PrivateKey
	pub     *rsa.PublicKey
	issuer  string
	keyID   string
}

type user struct {
	ID           string `json:"id"`
	Email        string `json:"email"`
	PasswordHash string `json:"-"`
}

func main() {
	a := &app{
		issuer: env("ISSUER", "https://id.alsamos.com"),
		keyID:  env("JWT_KEY_ID", "alsamos-id-stage2"),
	}
	a.priv = mustPrivateKey(os.Getenv("JWT_PRIVATE_KEY"))
	a.pub = &a.priv.PublicKey
	if pub := strings.TrimSpace(os.Getenv("JWT_PUBLIC_KEY")); pub != "" {
		a.pub = mustPublicKey(pub)
	}

	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal(err)
	}
	a.db = db
	if err := a.migrate(context.Background()); err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", a.health)
	mux.HandleFunc("/signup", a.signup)
	mux.HandleFunc("/login", a.login)
	mux.HandleFunc("/token", a.token)
	mux.HandleFunc("/userinfo", a.userinfo)
	mux.HandleFunc("/.well-known/openid-configuration", a.discovery)
	mux.HandleFunc("/jwks.json", a.jwks)

	log.Println("alsamos-id listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

func (a *app) migrate(ctx context.Context) error {
	_, err := a.db.ExecContext(ctx, `
CREATE SCHEMA IF NOT EXISTS identity;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS identity.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS identity.refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);`)
	return err
}

func (a *app) health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (a *app) signup(w http.ResponseWriter, r *http.Request) {
	var in struct{ Email, Password string }
	if !decodeInput(r, &in) || in.Email == "" || len(in.Password) < 8 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "email and password required"})
		return
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), bcrypt.DefaultCost)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "hash_failed"})
		return
	}
	var u user
	err = a.db.QueryRowContext(r.Context(), `insert into identity.users(email,password_hash) values($1,$2) returning id,email`, strings.ToLower(in.Email), string(hash)).Scan(&u.ID, &u.Email)
	if err != nil {
		writeJSON(w, http.StatusConflict, map[string]string{"error": "user_exists"})
		return
	}
	tok, _ := a.issue(u)
	writeJSON(w, http.StatusOK, map[string]any{"user": u, "access_token": tok, "token_type": "Bearer", "expires_in": 3600, "shadow": true})
}

func (a *app) login(w http.ResponseWriter, r *http.Request) {
	u, ok := a.checkPassword(w, r)
	if !ok {
		return
	}
	tok, _ := a.issue(u)
	writeJSON(w, http.StatusOK, map[string]any{"user": u, "access_token": tok, "token_type": "Bearer", "expires_in": 3600, "shadow": true})
}

func (a *app) token(w http.ResponseWriter, r *http.Request) {
	u, ok := a.checkPassword(w, r)
	if !ok {
		return
	}
	tok, _ := a.issue(u)
	writeJSON(w, http.StatusOK, map[string]any{"access_token": tok, "id_token": tok, "token_type": "Bearer", "expires_in": 3600})
}

func (a *app) userinfo(w http.ResponseWriter, r *http.Request) {
	claims, err := a.bearerClaims(r)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_token"})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"sub": claims["sub"], "email": claims["email"], "iss": a.issuer})
}

func (a *app) discovery(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"issuer": a.issuer,
		"jwks_uri": a.issuer + "/jwks.json",
		"authorization_endpoint": a.issuer + "/authorize",
		"token_endpoint": a.issuer + "/token",
		"userinfo_endpoint": a.issuer + "/userinfo",
		"response_types_supported": []string{"code"},
		"grant_types_supported": []string{"password", "refresh_token"},
		"subject_types_supported": []string{"public"},
		"id_token_signing_alg_values_supported": []string{"RS256"},
	})
}

func (a *app) jwks(w http.ResponseWriter, r *http.Request) {
	n := base64.RawURLEncoding.EncodeToString(a.pub.N.Bytes())
	e := base64.RawURLEncoding.EncodeToString(big.NewInt(int64(a.pub.E)).Bytes())
	writeJSON(w, http.StatusOK, map[string]any{"keys": []map[string]string{{
		"kty": "RSA", "use": "sig", "kid": a.keyID, "alg": "RS256", "n": n, "e": e,
	}}})
}

func (a *app) checkPassword(w http.ResponseWriter, r *http.Request) (user, bool) {
	var in struct{ Email, Password string }
	if !decodeInput(r, &in) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "bad_request"})
		return user{}, false
	}
	var u user
	err := a.db.QueryRowContext(r.Context(), `select id,email,password_hash from identity.users where email=$1`, strings.ToLower(in.Email)).Scan(&u.ID, &u.Email, &u.PasswordHash)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(in.Password)) != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid_credentials"})
		return user{}, false
	}
	return u, true
}

func (a *app) issue(u user) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{"iss": a.issuer, "sub": u.ID, "email": u.Email, "iat": now.Unix(), "exp": now.Add(time.Hour).Unix(), "aud": "alsamos"}
	t := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	t.Header["kid"] = a.keyID
	return t.SignedString(a.priv)
}

func (a *app) bearerClaims(r *http.Request) (jwt.MapClaims, error) {
	h := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
	if h == "" {
		return nil, errors.New("missing")
	}
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(h, claims, func(t *jwt.Token) (any, error) { return a.pub, nil }, jwt.WithIssuer(a.issuer))
	return claims, err
}

func decodeInput(r *http.Request, v any) bool {
	if strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
		return json.NewDecoder(r.Body).Decode(v) == nil
	}
	if err := r.ParseForm(); err != nil {
		return false
	}
	b, _ := json.Marshal(map[string]string{"Email": r.Form.Get("email"), "Password": r.Form.Get("password")})
	return json.Unmarshal(b, v) == nil
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}

func env(k, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(k)); v != "" {
		return v
	}
	return fallback
}

func mustPrivateKey(s string) *rsa.PrivateKey {
	block, _ := pem.Decode([]byte(s))
	if block == nil {
		log.Fatal("JWT_PRIVATE_KEY missing")
	}
	key, err := x509.ParsePKCS8PrivateKey(block.Bytes)
	if err != nil {
		if pkcs1, err1 := x509.ParsePKCS1PrivateKey(block.Bytes); err1 == nil {
			return pkcs1
		}
		log.Fatal(err)
	}
	return key.(*rsa.PrivateKey)
}

func mustPublicKey(s string) *rsa.PublicKey {
	block, _ := pem.Decode([]byte(s))
	if block == nil {
		log.Fatal("JWT_PUBLIC_KEY invalid")
	}
	key, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		log.Fatal(err)
	}
	return key.(*rsa.PublicKey)
}

func tokenHash(token string) string {
	sum := sha256.Sum256([]byte(token))
	return base64.RawURLEncoding.EncodeToString(sum[:])
}
