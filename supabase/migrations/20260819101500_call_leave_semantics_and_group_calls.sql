-- Alsamos call-system fix: correct leave semantics for 1:1 vs group calls,
-- explicit group-call flag on the legacy video_calls contract, and a mesh
-- participant cap enforced server-side.
--
-- Root cause fixed here: the client ended the call row unconditionally when any
-- participant left, which ended a group call for everyone. Ending the call is
-- now a server decision: a group call only ends when the last connected
-- participant leaves (or the host explicitly ends it for everyone).
--
-- NOTE ON SCALE: 'p2p' mesh is only viable for small groups. The cap below
-- (public.mesh_call_participant_cap) is the hard ceiling until an SFU backend
-- (LiveKit, already modeled as calls.media_backend = 'livekit') is deployed.

BEGIN;

ALTER TABLE public.video_calls
  ADD COLUMN IF NOT EXISTS is_group_call boolean NOT NULL DEFAULT false;

-- Existing rows created before this column: infer from max_participants.
UPDATE public.video_calls
SET is_group_call = true
WHERE is_group_call = false AND COALESCE(max_participants, 2) > 2;

CREATE OR REPLACE FUNCTION public.mesh_call_participant_cap()
RETURNS integer LANGUAGE sql IMMUTABLE AS $$ SELECT 8; $$;

-- Join a legacy (p2p/mesh) call with a server-enforced participant cap.
CREATE OR REPLACE FUNCTION public.rpc_join_video_call(p_call_id uuid)
RETURNS public.video_calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_call public.video_calls;
  v_active integer;
  v_cap integer;
  v_existing public.call_participants;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;

  SELECT * INTO v_call FROM public.video_calls WHERE id = p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  IF v_call.status IN ('ended', 'declined', 'missed') THEN RAISE EXCEPTION 'call_ended'; END IF;

  SELECT * INTO v_existing
  FROM public.call_participants
  WHERE call_id = p_call_id AND user_id = auth.uid()
  FOR UPDATE;

  IF NOT FOUND OR v_existing.connection_status = 'left' THEN
    v_cap := CASE
      WHEN v_call.is_group_call
        THEN LEAST(GREATEST(COALESCE(v_call.max_participants, 2), 2), public.mesh_call_participant_cap())
      ELSE 2
    END;

    SELECT count(*) INTO v_active
    FROM public.call_participants
    WHERE call_id = p_call_id
      AND connection_status IN ('connecting', 'connected')
      AND user_id <> auth.uid();

    IF v_active >= v_cap THEN RAISE EXCEPTION 'call_full'; END IF;
  END IF;

  INSERT INTO public.call_participants (call_id, user_id, role, connection_status, is_video_on, joined_at)
  VALUES (
    p_call_id,
    auth.uid(),
    CASE WHEN v_call.host_id = auth.uid() THEN 'host' ELSE 'participant' END,
    'connected',
    v_call.call_type = 'video',
    now()
  )
  ON CONFLICT (call_id, user_id) DO UPDATE
    SET connection_status = 'connected',
        left_at = NULL,
        joined_at = COALESCE(public.call_participants.joined_at, now());

  UPDATE public.video_calls
  SET status = CASE WHEN status IN ('waiting', 'ringing') THEN 'active' ELSE status END,
      started_at = COALESCE(started_at, now())
  WHERE id = p_call_id
  RETURNING * INTO v_call;

  RETURN v_call;
END;
$$;

-- Leave a call. THE CORE FIX: the call row is only marked 'ended' when the call
-- is 1:1, or when the leaving participant was the last connected one.
CREATE OR REPLACE FUNCTION public.rpc_leave_video_call(p_call_id uuid)
RETURNS public.video_calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_call public.video_calls;
  v_remaining integer;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;

  SELECT * INTO v_call FROM public.video_calls WHERE id = p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;

  UPDATE public.call_participants
  SET connection_status = 'left', left_at = COALESCE(left_at, now())
  WHERE call_id = p_call_id AND user_id = auth.uid();

  SELECT count(*) INTO v_remaining
  FROM public.call_participants
  WHERE call_id = p_call_id AND connection_status IN ('connecting', 'connected');

  IF (NOT v_call.is_group_call OR v_remaining = 0)
     AND v_call.status NOT IN ('ended', 'declined', 'missed') THEN
    UPDATE public.video_calls
    SET status = 'ended', ended_at = COALESCE(ended_at, now())
    WHERE id = p_call_id
    RETURNING * INTO v_call;
  END IF;

  RETURN v_call;
END;
$$;

-- Host-only: end a group call for every participant.
CREATE OR REPLACE FUNCTION public.rpc_end_video_call_for_everyone(p_call_id uuid)
RETURNS public.video_calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_call public.video_calls;
BEGIN
  SELECT * INTO v_call FROM public.video_calls WHERE id = p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  IF v_call.host_id <> auth.uid() THEN RAISE EXCEPTION 'not_call_host'; END IF;

  UPDATE public.call_participants
  SET connection_status = 'left', left_at = COALESCE(left_at, now())
  WHERE call_id = p_call_id AND connection_status IN ('connecting', 'connected');

  IF v_call.status NOT IN ('ended', 'declined', 'missed') THEN
    UPDATE public.video_calls
    SET status = 'ended', ended_at = COALESCE(ended_at, now())
    WHERE id = p_call_id
    RETURNING * INTO v_call;
  END IF;

  RETURN v_call;
END;
$$;

GRANT EXECUTE ON FUNCTION public.mesh_call_participant_cap() TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_join_video_call(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_leave_video_call(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_end_video_call_for_everyone(uuid) TO authenticated;

COMMIT;
