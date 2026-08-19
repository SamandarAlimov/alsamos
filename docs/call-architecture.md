# Alsamos call architecture

Three distinct call surfaces, deliberately kept separate:

| Surface | Topology | Backend | Ends when |
| --- | --- | --- | --- |
| 1:1 call | single peer connection | p2p (mesh) | either side leaves |
| Group call | mesh, N*(N-1) peer connections | p2p (mesh), capped | last connected participant leaves, or host ends it for everyone |
| Channel broadcast | one publisher, many viewers | live-stream path (`LiveStreamBroadcast` / `LiveStreamViewer`) | publisher stops the stream |

## Leave semantics (server-owned)

Whether a call ends is decided in the database, never by the leaving client:

- `rpc_leave_video_call(call_id)` marks the caller's participant row as `left`.
  It marks the call `ended` only when the call is 1:1, or when no connected
  participants remain.
- `rpc_end_video_call_for_everyone(call_id)` is host-only and ends the call for
  all participants.
- `rpc_join_video_call(call_id)` enforces the participant cap and returns
  `call_full` when the call is at capacity.

Clients react to a `video_calls` row reaching `ended`/`declined`/`missed` by
tearing down their session. Because a group participant leaving no longer
writes that status, remaining participants stay connected; their WebRTC layer
only closes the individual peer connection (Realtime presence `leave` and the
`leave` broadcast event).

## Participant cap and the SFU next step

Mesh is capped at `MESH_PARTICIPANT_CAP = 8`
(`public.mesh_call_participant_cap()` mirrors it server-side). Beyond ~8
participants, mesh uplink cost grows linearly per participant and mobile
clients degrade badly.

Removing the cap requires an SFU, which is explicitly **not** implemented yet:

- **Media server**: LiveKit is the intended target — the canonical `calls`
  table already models `media_backend IN ('p2p','livekit')` and `room_name`.
- **Can edge functions host it?** No. An SFU needs a long-lived, always-on
  process with UDP/TURN reachability; Supabase edge functions are short-lived
  request handlers. They can only mint access tokens and manage room lifecycle
  against a separately hosted LiveKit cluster (LiveKit Cloud or self-hosted).
- **Scope**: deploy/subscribe to a LiveKit cluster, add a token-minting
  function, route conference calls to a LiveKit client track subscription model
  instead of `useWebRTCRealtime`, and keep the p2p path for 1:1 calls.

## Signaling

Signaling runs entirely over Supabase Realtime broadcast/presence
(`useWebRTCRealtime`). The unused `supabase/functions/webrtc-signaling` edge
function was removed; the live-stream path keeps its own
`supabase/functions/live-stream-signaling`.
