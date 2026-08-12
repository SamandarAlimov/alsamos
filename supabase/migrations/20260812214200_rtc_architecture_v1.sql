-- Alsamos RTC Architecture v1
-- Canonical call state is server-owned. Conversation membership never creates call membership.

BEGIN;

-- Preserve historical rows while moving the live schema to the canonical names.
ALTER TABLE IF EXISTS public.video_calls RENAME TO calls;
ALTER TABLE IF EXISTS public.call_participants RENAME TO call_participants_legacy;

ALTER TABLE public.calls
  ADD COLUMN IF NOT EXISTS type text,
  ADD COLUMN IF NOT EXISTS media_backend text,
  ADD COLUMN IF NOT EXISTS room_name text,
  ADD COLUMN IF NOT EXISTS ended_by uuid,
  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.calls
SET type = CASE WHEN COALESCE(max_participants, 2) <= 2 THEN 'direct' ELSE 'conference' END
WHERE type IS NULL;

UPDATE public.calls
SET media_backend = CASE WHEN COALESCE(max_participants, 2) <= 2 THEN 'p2p' ELSE 'livekit' END
WHERE media_backend IS NULL;

UPDATE public.calls SET status = 'ringing' WHERE status = 'waiting';

ALTER TABLE public.calls
  ALTER COLUMN type SET DEFAULT 'direct',
  ALTER COLUMN media_backend SET DEFAULT 'p2p';

ALTER TABLE public.calls
  DROP CONSTRAINT IF EXISTS calls_type_check,
  DROP CONSTRAINT IF EXISTS calls_status_check,
  DROP CONSTRAINT IF EXISTS calls_media_backend_check;

ALTER TABLE public.calls
  ADD CONSTRAINT calls_type_check CHECK (type IN ('direct','conference')),
  ADD CONSTRAINT calls_status_check CHECK (status IN ('ringing','active','ended','declined','missed')),
  ADD CONSTRAINT calls_media_backend_check CHECK (media_backend IN ('p2p','livekit')),
  ADD CONSTRAINT calls_backend_type_check CHECK ((type = 'direct' AND media_backend = 'p2p') OR (type = 'conference' AND media_backend = 'livekit'));

ALTER TABLE public.calls
  ADD CONSTRAINT calls_ended_by_fkey FOREIGN KEY (ended_by) REFERENCES public.profiles(id);

CREATE TABLE public.call_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id uuid NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'participant' CHECK (role IN ('host','participant')),
  connection_status text NOT NULL DEFAULT 'disconnected' CHECK (connection_status IN ('disconnected','connecting','connected','left')),
  is_muted boolean NOT NULL DEFAULT false,
  is_video_on boolean NOT NULL DEFAULT true,
  is_screen_sharing boolean NOT NULL DEFAULT false,
  is_hand_raised boolean NOT NULL DEFAULT false,
  joined_at timestamptz,
  left_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(call_id, user_id)
);

INSERT INTO public.call_participants (id, call_id, user_id, role, connection_status, is_muted, is_video_on, is_screen_sharing, is_hand_raised, joined_at, left_at, created_at)
SELECT
  p.id, p.call_id, p.user_id,
  CASE WHEN p.user_id = c.host_id THEN 'host' ELSE 'participant' END,
  CASE WHEN p.left_at IS NOT NULL THEN 'left' ELSE 'connected' END,
  p.is_muted, p.is_video_on, p.is_screen_sharing, p.is_hand_raised,
  p.joined_at, p.left_at, COALESCE(p.joined_at, c.created_at)
FROM public.call_participants_legacy p
JOIN public.calls c ON c.id = p.call_id
ON CONFLICT (call_id, user_id) DO NOTHING;

-- The legacy participant table is kept as an immutable migration archive.
ALTER TABLE public.call_participants_legacy ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.call_invites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id uuid NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','ringing','accepted','declined','missed')),
  notified_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(call_id, invitee_id),
  CHECK (inviter_id <> invitee_id)
);

INSERT INTO public.call_invites (call_id, inviter_id, invitee_id, status, responded_at, created_at)
SELECT p.call_id, c.host_id, p.user_id, 'accepted', p.joined_at, COALESCE(p.joined_at, c.created_at)
FROM public.call_participants_legacy p
JOIN public.calls c ON c.id = p.call_id
WHERE p.user_id <> c.host_id
ON CONFLICT (call_id, invitee_id) DO NOTHING;

CREATE TABLE public.stream_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  channel_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  notified_at timestamptz,
  UNIQUE(channel_id, user_id)
);

CREATE INDEX calls_host_id_idx ON public.calls(host_id);
CREATE INDEX calls_conversation_id_idx ON public.calls(conversation_id);
CREATE INDEX calls_status_idx ON public.calls(status);
CREATE INDEX call_participants_call_id_status_idx ON public.call_participants(call_id, connection_status);
CREATE INDEX call_participants_user_id_idx ON public.call_participants(user_id);
CREATE INDEX call_invites_invitee_status_idx ON public.call_invites(invitee_id, status);
CREATE INDEX call_invites_call_id_idx ON public.call_invites(call_id);
CREATE INDEX stream_subscribers_channel_id_idx ON public.stream_subscribers(channel_id);

-- Security-definer helpers avoid RLS self-recursion.
CREATE OR REPLACE FUNCTION public.is_call_participant(_call_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.call_participants WHERE call_id = _call_id AND user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_call_invitee(_call_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.call_invites WHERE call_id = _call_id AND invitee_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.rpc_create_call(
  p_type text,
  p_conversation_id uuid,
  p_media_backend text,
  p_max_participants integer,
  p_invitee_ids uuid[] DEFAULT '{}'::uuid[]
)
RETURNS public.calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_call public.calls; v_id uuid; v_invite uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF p_type NOT IN ('direct','conference') THEN RAISE EXCEPTION 'invalid_call_type'; END IF;
  IF (p_type = 'direct' AND p_media_backend <> 'p2p') OR (p_type = 'conference' AND p_media_backend <> 'livekit') THEN RAISE EXCEPTION 'invalid_media_backend'; END IF;
  IF p_max_participants < 2 OR p_max_participants > 100 THEN RAISE EXCEPTION 'invalid_participant_limit'; END IF;
  IF p_type = 'direct' AND COALESCE(array_length(p_invitee_ids,1),0) <> 1 THEN RAISE EXCEPTION 'direct_call_requires_one_invitee'; END IF;
  IF COALESCE(array_length(p_invitee_ids,1),0) > p_max_participants - 1 THEN RAISE EXCEPTION 'participant_limit_reached'; END IF;
  IF auth.uid() = ANY(COALESCE(p_invitee_ids,'{}'::uuid[])) THEN RAISE EXCEPTION 'cannot_invite_self'; END IF;

  INSERT INTO public.calls(id,type,host_id,conversation_id,status,media_backend,max_participants,metadata)
  VALUES(gen_random_uuid(),p_type,auth.uid(),p_conversation_id,'ringing',p_media_backend,p_max_participants,'{}'::jsonb)
  RETURNING * INTO v_call;

  INSERT INTO public.call_participants(call_id,user_id,role,connection_status)
  VALUES(v_call.id,auth.uid(),'host','disconnected');

  FOREACH v_id IN ARRAY COALESCE(p_invitee_ids,'{}'::uuid[]) LOOP
    INSERT INTO public.call_invites(call_id,inviter_id,invitee_id,status)
    VALUES(v_call.id,auth.uid(),v_id,'pending') RETURNING id INTO v_invite;
  END LOOP;
  RETURN v_call;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_invite_participants(p_call_id uuid, p_invitee_ids uuid[])
RETURNS SETOF public.call_invites
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.calls; uid uuid;
BEGIN
  SELECT * INTO c FROM public.calls WHERE id=p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  IF c.host_id <> auth.uid() THEN RAISE EXCEPTION 'not_call_host'; END IF;
  IF c.status NOT IN ('ringing','active') THEN RAISE EXCEPTION 'call_not_ringing'; END IF;
  IF (SELECT count(*) FROM public.call_participants WHERE call_id=p_call_id AND connection_status IN ('connecting','connected')) + COALESCE(array_length(p_invitee_ids,1),0) > c.max_participants THEN RAISE EXCEPTION 'participant_limit_reached'; END IF;
  FOREACH uid IN ARRAY COALESCE(p_invitee_ids,'{}'::uuid[]) LOOP
    IF uid <> auth.uid() THEN
      INSERT INTO public.call_invites(call_id,inviter_id,invitee_id,status)
      VALUES(p_call_id,auth.uid(),uid,'pending') ON CONFLICT (call_id,invitee_id) DO NOTHING;
    END IF;
  END LOOP;
  RETURN QUERY SELECT * FROM public.call_invites WHERE call_id=p_call_id ORDER BY created_at;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_respond_to_invite(p_call_invite_id uuid, p_response text)
RETURNS public.call_invites
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE i public.call_invites; c public.calls; out_i public.call_invites;
BEGIN
  IF p_response NOT IN ('accepted','declined') THEN RAISE EXCEPTION 'invalid_state_transition'; END IF;
  SELECT * INTO i FROM public.call_invites WHERE id=p_call_invite_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'invite_not_found'; END IF;
  IF i.invitee_id <> auth.uid() THEN RAISE EXCEPTION 'invite_not_for_user'; END IF;
  IF i.status NOT IN ('pending','ringing') THEN RAISE EXCEPTION 'invite_already_responded'; END IF;
  SELECT * INTO c FROM public.calls WHERE id=i.call_id FOR UPDATE;
  UPDATE public.call_invites SET status=p_response, responded_at=now() WHERE id=i.id RETURNING * INTO out_i;
  IF p_response='accepted' THEN
    INSERT INTO public.call_participants(call_id,user_id,role,connection_status)
    VALUES(i.call_id,auth.uid(),'participant','connecting')
    ON CONFLICT (call_id,user_id) DO UPDATE SET connection_status='connecting', left_at=NULL;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM public.call_participants WHERE call_id=i.call_id AND connection_status IN ('connecting','connected'))
       AND NOT EXISTS (SELECT 1 FROM public.call_invites WHERE call_id=i.call_id AND id<>i.id AND status IN ('pending','ringing','accepted')) THEN
      UPDATE public.calls SET status='declined',ended_at=COALESCE(ended_at,now()) WHERE id=i.call_id AND status='ringing';
    END IF;
  END IF;
  RETURN out_i;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_mark_call_connected(p_call_id uuid)
RETURNS public.calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.calls; p public.call_participants; out_c public.calls;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  SELECT * INTO c FROM public.calls WHERE id=p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  SELECT * INTO p FROM public.call_participants WHERE call_id=p_call_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_call_participant'; END IF;
  IF c.status NOT IN ('ringing','active') THEN RAISE EXCEPTION 'call_ended'; END IF;
  UPDATE public.call_participants SET connection_status='connected',joined_at=COALESCE(joined_at,now()),left_at=NULL WHERE id=p.id;
  UPDATE public.calls SET status='active',started_at=COALESCE(started_at,now()) WHERE id=p_call_id RETURNING * INTO out_c;
  RETURN out_c;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_leave_call(p_call_id uuid)
RETURNS public.calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.call_participants; c public.calls; remaining integer; out_c public.calls;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  SELECT * INTO c FROM public.calls WHERE id=p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  SELECT * INTO p FROM public.call_participants WHERE call_id=p_call_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_call_participant'; END IF;
  IF p.connection_status='left' THEN RETURN c; END IF;
  UPDATE public.call_participants SET connection_status='left',left_at=COALESCE(left_at,now()) WHERE id=p.id;
  SELECT count(*) INTO remaining FROM public.call_participants WHERE call_id=p_call_id AND connection_status IN ('connecting','connected');
  IF remaining = 0 AND c.status NOT IN ('ended','declined','missed') THEN
    UPDATE public.calls SET status='ended',ended_at=COALESCE(ended_at,now()),ended_by=NULL WHERE id=p_call_id RETURNING * INTO out_c;
  ELSE
    SELECT * INTO out_c FROM public.calls WHERE id=p_call_id;
  END IF;
  RETURN out_c;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_end_call_for_everyone(p_call_id uuid)
RETURNS public.calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c public.calls; out_c public.calls;
BEGIN
  SELECT * INTO c FROM public.calls WHERE id=p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  IF c.host_id <> auth.uid() THEN RAISE EXCEPTION 'not_call_host'; END IF;
  IF c.status='ended' THEN RETURN c; END IF;
  UPDATE public.calls SET status='ended',ended_at=COALESCE(ended_at,now()),ended_by=auth.uid() WHERE id=p_call_id RETURNING * INTO out_c;
  UPDATE public.call_participants SET connection_status='left',left_at=COALESCE(left_at,now()) WHERE call_id=p_call_id AND connection_status IN ('connecting','connected');
  RETURN out_c;
END;
$$;

CREATE OR REPLACE FUNCTION public.rpc_set_call_media_state(p_call_id uuid, p_is_muted boolean, p_is_video_on boolean, p_is_screen_sharing boolean, p_is_hand_raised boolean)
RETURNS public.call_participants
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.call_participants;
BEGIN
  SELECT * INTO p FROM public.call_participants WHERE call_id=p_call_id AND user_id=auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_call_participant'; END IF;
  UPDATE public.call_participants SET is_muted=p_is_muted,is_video_on=p_is_video_on,is_screen_sharing=p_is_screen_sharing,is_hand_raised=p_is_hand_raised WHERE id=p.id RETURNING * INTO p;
  RETURN p;
END;
$$;

-- Calls and participants are visible only to actual participants, hosts, or explicit invitees.
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Calls viewable by participants" ON public.calls;
DROP POLICY IF EXISTS "Call participants viewable" ON public.call_participants;
DROP POLICY IF EXISTS "Call invites viewable" ON public.call_invites;

CREATE POLICY "rtc_calls_select" ON public.calls FOR SELECT TO authenticated USING (host_id=auth.uid() OR public.is_call_participant(id,auth.uid()) OR public.is_call_invitee(id,auth.uid()));
CREATE POLICY "rtc_participants_select" ON public.call_participants FOR SELECT TO authenticated USING (public.is_call_participant(call_id,auth.uid()));
CREATE POLICY "rtc_participants_media_update" ON public.call_participants FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
CREATE POLICY "rtc_invites_select" ON public.call_invites FOR SELECT TO authenticated USING (inviter_id=auth.uid() OR invitee_id=auth.uid());
CREATE POLICY "rtc_invites_update_own_response" ON public.call_invites FOR UPDATE TO authenticated USING (invitee_id=auth.uid()) WITH CHECK (invitee_id=auth.uid());
CREATE POLICY "rtc_stream_subscribers_select" ON public.stream_subscribers FOR SELECT TO authenticated USING (user_id=auth.uid());
CREATE POLICY "rtc_stream_subscribers_insert_own" ON public.stream_subscribers FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid());
CREATE POLICY "rtc_stream_subscribers_delete_own" ON public.stream_subscribers FOR DELETE TO authenticated USING (user_id=auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.calls FROM authenticated;
REVOKE INSERT, DELETE ON public.call_participants FROM authenticated;
REVOKE INSERT, DELETE ON public.call_invites FROM authenticated;

GRANT EXECUTE ON FUNCTION public.rpc_create_call(text,uuid,text,integer,uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_invite_participants(uuid,uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_respond_to_invite(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_mark_call_connected(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_leave_call(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_end_call_for_everyone(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.rpc_set_call_media_state(uuid,boolean,boolean,boolean,boolean) TO authenticated;

COMMIT;
