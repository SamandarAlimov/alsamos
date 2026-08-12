package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/livekit/protocol/auth"
)

type rtcError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type rtcCreateRequest struct {
	Type             string   `json:"type"`
	ConversationID   *string  `json:"conversation_id"`
	MediaBackend     string   `json:"media_backend"`
	MaxParticipants  int      `json:"max_participants"`
	InviteeIDs       []string `json:"invitee_ids"`
}

type rtcRespondRequest struct {
	Response string `json:"response"`
}

type rtcMediaRequest struct {
	Muted         bool `json:"is_muted"`
	VideoOn       bool `json:"is_video_on"`
	ScreenSharing bool `json:"is_screen_sharing"`
	HandRaised    bool `json:"is_hand_raised"`
}

type supabaseRPCError struct {
	Message string `json:"message"`
	Details string `json:"details"`
	Hint    string `json:"hint"`
	Code    string `json:"code"`
}

func (a *app) registerRTCRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/rtc/calls", a.rtcCalls)
	mux.HandleFunc("/api/rtc/calls/", a.rtcCallRoute)
}

func (a *app) rtcCalls(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		a.rtcCreateCall(w, r)
		return
	}
	if r.Method == http.MethodGet {
		a.rtcIncomingCalls(w, r)
		return
	}
	writeRTCError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "method not allowed")
}

func (a *app) rtcCallRoute(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(strings.TrimPrefix(r.URL.Path, "/api/rtc/calls/"), "/"), "/")
	if len(parts) == 0 || parts[0] == "" {
		writeRTCError(w, http.StatusNotFound, "CALL_NOT_FOUND", "call not found")
		return
	}
	callID := parts[0]
	if len(parts) == 1 && r.Method == http.MethodGet {
		a.rtcGetCall(w, r, callID)
		return
	}
	if len(parts) == 2 {
		switch parts[1] {
		case "join":
			if r.Method == http.MethodPost { a.rtcRPCCall(w, r, "rpc_mark_call_connected", callID); return }
		case "connected":
			if r.Method == http.MethodPost { a.rtcRPCCall(w, r, "rpc_mark_call_connected", callID); return }
		case "leave":
			if r.Method == http.MethodPost { a.rtcRPCCall(w, r, "rpc_leave_call", callID); return }
		case "end":
			if r.Method == http.MethodPost { a.rtcRPCCall(w, r, "rpc_end_call_for_everyone", callID); return }
		case "media":
			if r.Method == http.MethodPost { a.rtcMedia(w, r, callID); return }
		case "livekit-token":
			if r.Method == http.MethodGet || r.Method == http.MethodPost { a.rtcLiveKitToken(w, r, callID); return }
		case "participants":
			if r.Method == http.MethodGet { a.rtcGetParticipants(w, r, callID); return }
		case "invite":
			if r.Method == http.MethodPost { a.rtcInvite(w, r, callID); return }
		case "respond":
			if r.Method == http.MethodPost { a.rtcRespond(w, r, callID); return }
		}
	}
	if len(parts) == 3 && parts[1] == "invite" && parts[2] == "respond" && r.Method == http.MethodPost {
		writeRTCError(w, http.StatusNotImplemented, "INVALID_ROUTE", "use /calls/{id}/respond")
		return
	}
	writeRTCError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "method not allowed")
}

func (a *app) rtcCreateCall(w http.ResponseWriter, r *http.Request) {
	var in rtcCreateRequest
	if err := json.NewDecoder(io.LimitReader(r.Body, 64*1024)).Decode(&in); err != nil {
		writeRTCError(w, http.StatusBadRequest, "INVALID_JSON", "invalid JSON body")
		return
	}
	if in.MaxParticipants == 0 { in.MaxParticipants = 2 }
	if in.MediaBackend == "" { if in.Type == "conference" { in.MediaBackend = "livekit" } else { in.MediaBackend = "p2p" } }
	args := map[string]any{
		"p_type": in.Type,
		"p_conversation_id": in.ConversationID,
		"p_media_backend": in.MediaBackend,
		"p_max_participants": in.MaxParticipants,
		"p_invitee_ids": in.InviteeIDs,
	}
	var call map[string]any
	if err := a.supabaseRPC(r.Context(), r, "rpc_create_call", args, &call); err != nil { writeSupabaseRTCError(w, err); return }
	if in.Type == "conference" {
		callID, _ := call["id"].(string)
		room := "alsamos-call-" + callID
		if err := a.supabaseRPC(r.Context(), r, "rpc_set_call_room_name", map[string]any{"p_call_id": callID, "p_room_name": room}, &call); err != nil { writeSupabaseRTCError(w, err); return }
	}
	writeJSON(w, http.StatusCreated, map[string]any{"call": call})
}

func (a *app) rtcGetCall(w http.ResponseWriter, r *http.Request, callID string) {
	var out []map[string]any
	if err := a.supabaseTable(r.Context(), r, "calls", "select=*\u0026id=eq."+callID+"\u0026limit=1", &out); err != nil { writeSupabaseRTCError(w, err); return }
	if len(out) == 0 { writeRTCError(w, http.StatusNotFound, "CALL_NOT_FOUND", "call not found"); return }
	writeJSON(w, http.StatusOK, out[0])
}

func (a *app) rtcGetParticipants(w http.ResponseWriter, r *http.Request, callID string) {
	var out []map[string]any
	if err := a.supabaseTable(r.Context(), r, "call_participants", "select=*\u0026call_id=eq."+callID+"\u0026order=created_at.asc", &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, out)
}

func (a *app) rtcIncomingCalls(w http.ResponseWriter, r *http.Request) {
	var out []map[string]any
	query := "select=id,call_id,inviter_id,invitee_id,status,notified_at,responded_at,created_at\u0026invitee_id=eq." + claimsFromContext(r.Context()).Sub + "\u0026status=in.(pending,ringing)\u0026order=created_at.desc"
	if err := a.supabaseTable(r.Context(), r, "call_invites", query, &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, map[string]any{"invites": out})
}

func (a *app) rtcInvite(w http.ResponseWriter, r *http.Request, callID string) {
	var in struct { InviteeIDs []string `json:"invitee_ids"` }
	if err := json.NewDecoder(io.LimitReader(r.Body, 64*1024)).Decode(&in); err != nil { writeRTCError(w, http.StatusBadRequest, "INVALID_JSON", "invalid JSON body"); return }
	var out []map[string]any
	if err := a.supabaseRPC(r.Context(), r, "rpc_invite_participants", map[string]any{"p_call_id": callID, "p_invitee_ids": in.InviteeIDs}, &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, map[string]any{"invites": out})
}

func (a *app) rtcRespond(w http.ResponseWriter, r *http.Request, callID string) {
	var in rtcRespondRequest
	if err := json.NewDecoder(io.LimitReader(r.Body, 16*1024)).Decode(&in); err != nil { writeRTCError(w, http.StatusBadRequest, "INVALID_JSON", "invalid JSON body"); return }
	var invites []map[string]any
	query := "select=id\u0026call_id=eq." + callID + "\u0026invitee_id=eq." + claimsFromContext(r.Context()).Sub + "\u0026limit=1"
	if err := a.supabaseTable(r.Context(), r, "call_invites", query, &invites); err != nil { writeSupabaseRTCError(w, err); return }
	if len(invites) == 0 { writeRTCError(w, http.StatusForbidden, "INVITE_NOT_FOR_USER", "invite not found for current user"); return }
	inviteID, _ := invites[0]["id"].(string)
	var out map[string]any
	if err := a.supabaseRPC(r.Context(), r, "rpc_respond_to_invite", map[string]any{"p_call_invite_id": inviteID, "p_response": in.Response}, &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, out)
}

func (a *app) rtcMedia(w http.ResponseWriter, r *http.Request, callID string) {
	var in rtcMediaRequest
	if err := json.NewDecoder(io.LimitReader(r.Body, 16*1024)).Decode(&in); err != nil { writeRTCError(w, http.StatusBadRequest, "INVALID_JSON", "invalid JSON body"); return }
	var out map[string]any
	if err := a.supabaseRPC(r.Context(), r, "rpc_set_call_media_state", map[string]any{"p_call_id": callID,"p_is_muted":in.Muted,"p_is_video_on":in.VideoOn,"p_is_screen_sharing":in.ScreenSharing,"p_is_hand_raised":in.HandRaised}, &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, out)
}

func (a *app) rtcRPCCall(w http.ResponseWriter, r *http.Request, fn, callID string) {
	var out map[string]any
	if err := a.supabaseRPC(r.Context(), r, fn, map[string]any{"p_call_id": callID}, &out); err != nil { writeSupabaseRTCError(w, err); return }
	writeJSON(w, http.StatusOK, out)
}

func (a *app) rtcLiveKitToken(w http.ResponseWriter, r *http.Request, callID string) {
	if a.livekitAPIKey == "" || a.livekitAPISecret == "" || a.livekitURL == "" {
		writeRTCError(w, http.StatusServiceUnavailable, "LIVEKIT_NOT_CONFIGURED", "LiveKit is not configured")
		return
	}
	var calls []map[string]any
	query := "select=id,type,status,media_backend,room_name,host_id\u0026id=eq." + callID + "\u0026limit=1"
	if err := a.supabaseTable(r.Context(), r, "calls", query, &calls); err != nil { writeSupabaseRTCError(w, err); return }
	if len(calls)==0 { writeRTCError(w,http.StatusNotFound,"CALL_NOT_FOUND","call not found"); return }
	c := calls[0]
	if c["type"] != "conference" || c["media_backend"] != "livekit" { writeRTCError(w,http.StatusBadRequest,"INVALID_MEDIA_BACKEND","call is not a LiveKit conference"); return }
	var room string
	room, _ = c["room_name"].(string)
	if room == "" { room = "alsamos-call-" + callID }
	var participants []map[string]any
	if err := a.supabaseTable(r.Context(), r, "call_participants", "select=id\u0026call_id=eq."+callID+"\u0026user_id=eq."+claimsFromContext(r.Context()).Sub+"\u0026limit=1", &participants); err != nil { writeSupabaseRTCError(w,err); return }
	if len(participants)==0 {
		var invites []map[string]any
		if err := a.supabaseTable(r.Context(),r,"call_invites","select=id\u0026call_id=eq."+callID+"\u0026invitee_id=eq."+claimsFromContext(r.Context()).Sub+"\u0026status=eq.accepted\u0026limit=1",&invites); err != nil { writeSupabaseRTCError(w,err); return }
		if len(invites)==0 { writeRTCError(w,http.StatusForbidden,"FORBIDDEN","user is not an eligible call participant"); return }
	}
	at := auth.NewAccessToken(a.livekitAPIKey,a.livekitAPISecret)
	at.SetIdentity(claimsFromContext(r.Context()).Sub).SetValidFor(10*time.Minute).SetVideoGrant(&auth.VideoGrant{RoomJoin:true,Room:room,CanPublish:true,CanSubscribe:boolPtr(true)})
	token, err := at.ToJWT(); if err != nil { writeRTCError(w,http.StatusInternalServerError,"TOKEN_ERROR","failed to mint LiveKit token"); return }
	writeJSON(w,http.StatusOK,map[string]any{"call_id":callID,"room_name":room,"url":a.livekitURL,"token":token,"expires_at":time.Now().Add(10*time.Minute).UTC()})
}

func (a *app) supabaseRPC(ctx context.Context, r *http.Request, fn string, args map[string]any, out any) error {
	body, err := json.Marshal(args); if err != nil { return err }
	req, err := http.NewRequestWithContext(ctx,http.MethodPost,a.supabaseURL+"/rest/v1/rpc/"+fn,bytes.NewReader(body)); if err != nil { return err }
	a.applySupabaseAuth(req,r); req.Header.Set("Content-Type","application/json"); req.Header.Set("Prefer","return=representation")
	return a.doSupabase(req,out)
}

func (a *app) supabaseTable(ctx context.Context, r *http.Request, table, query string, out any) error {
	req, err := http.NewRequestWithContext(ctx,http.MethodGet,a.supabaseURL+"/rest/v1/"+table+"?"+query,nil); if err != nil { return err }
	a.applySupabaseAuth(req,r); return a.doSupabase(req,out)
}

func (a *app) applySupabaseAuth(req *http.Request, r *http.Request) {
	req.Header.Set("apikey",a.supabaseAnonKey)
	if v:=r.Header.Get("Authorization"); v!="" { req.Header.Set("Authorization",v) }
}

func (a *app) doSupabase(req *http.Request,out any) error {
	resp,err:=http.DefaultClient.Do(req); if err!=nil{return err}; defer resp.Body.Close()
	data,readErr:=io.ReadAll(io.LimitReader(resp.Body,2*1024*1024)); if readErr!=nil{return readErr}
	if resp.StatusCode<200||resp.StatusCode>=300 { var e supabaseRPCError; _=json.Unmarshal(data,&e); if e.Message=="" { e.Message=string(data) }; return fmt.Errorf("supabase:%d:%s",resp.StatusCode,e.Message) }
	if out==nil{return nil}; return json.Unmarshal(data,out)
}

func claimsFromContext(ctx context.Context) claims { if c,ok:=ctx.Value(claimsKey).(claims); ok{return c}; return claims{} }

func writeSupabaseRTCError(w http.ResponseWriter, err error) {
	msg:=err.Error(); code:="SUPABASE_ERROR"; status:=http.StatusBadGateway
	if strings.HasPrefix(msg,"supabase:") { parts:=strings.SplitN(msg,":",3); if len(parts)==3 { var n int; _,_=fmt.Sscanf(parts[1],"%d",&n); if n>=400&&n<500 {status=n}; msg=parts[2] } }
	writeRTCError(w,status,code,msg)
}

func writeRTCError(w http.ResponseWriter,status int,code,message string){ writeJSON(w,status,map[string]any{"error":rtcError{Code:code,Message:message}}) }

func boolPtr(v bool) *bool { return &v }
