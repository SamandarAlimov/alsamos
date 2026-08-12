BEGIN;

CREATE OR REPLACE FUNCTION public.rpc_set_call_room_name(p_call_id uuid, p_room_name text)
RETURNS public.calls
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE c public.calls; out_c public.calls;
BEGIN
  SELECT * INTO c FROM public.calls WHERE id=p_call_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'call_not_found'; END IF;
  IF c.host_id <> auth.uid() THEN RAISE EXCEPTION 'not_call_host'; END IF;
  IF c.type <> 'conference' OR c.media_backend <> 'livekit' THEN RAISE EXCEPTION 'invalid_media_backend'; END IF;
  IF p_room_name IS NULL OR length(trim(p_room_name)) < 8 OR length(p_room_name) > 128 THEN RAISE EXCEPTION 'invalid_room_name'; END IF;
  UPDATE public.calls SET room_name=trim(p_room_name) WHERE id=p_call_id RETURNING * INTO out_c;
  RETURN out_c;
END;
$$;

-- Replace create_call with the authorization check that conversation membership is required only
-- when the caller explicitly associates a call with a conversation. It never expands invitees.
CREATE OR REPLACE FUNCTION public.rpc_create_call(p_type text,p_conversation_id uuid,p_media_backend text,p_max_participants integer,p_invitee_ids uuid[] DEFAULT '{}'::uuid[])
RETURNS public.calls LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_call public.calls; uid uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF p_type NOT IN ('direct','conference') THEN RAISE EXCEPTION 'invalid_call_type'; END IF;
  IF (p_type='direct' AND p_media_backend<>'p2p') OR (p_type='conference' AND p_media_backend<>'livekit') THEN RAISE EXCEPTION 'invalid_media_backend'; END IF;
  IF p_max_participants < 2 OR p_max_participants > 100 THEN RAISE EXCEPTION 'invalid_participant_limit'; END IF;
  IF p_type='direct' AND COALESCE(array_length(p_invitee_ids,1),0) <> 1 THEN RAISE EXCEPTION 'direct_call_requires_one_invitee'; END IF;
  IF COALESCE(array_length(p_invitee_ids,1),0) > p_max_participants-1 THEN RAISE EXCEPTION 'participant_limit_reached'; END IF;
  IF auth.uid()=ANY(COALESCE(p_invitee_ids,'{}'::uuid[])) THEN RAISE EXCEPTION 'cannot_invite_self'; END IF;
  IF p_conversation_id IS NOT NULL AND NOT public.is_conversation_participant(p_conversation_id,auth.uid()) THEN RAISE EXCEPTION 'not_conversation_participant'; END IF;

  INSERT INTO public.calls(id,type,host_id,conversation_id,status,media_backend,max_participants,metadata)
  VALUES(gen_random_uuid(),p_type,auth.uid(),p_conversation_id,'ringing',p_media_backend,p_max_participants,'{}'::jsonb)
  RETURNING * INTO v_call;

  INSERT INTO public.call_participants(call_id,user_id,role,connection_status)
  VALUES(v_call.id,auth.uid(),'host','disconnected');

  FOREACH uid IN ARRAY COALESCE(p_invitee_ids,'{}'::uuid[]) LOOP
    INSERT INTO public.call_invites(call_id,inviter_id,invitee_id,status)
    VALUES(v_call.id,auth.uid(),uid,'pending');
  END LOOP;
  RETURN v_call;
END;
$$;

GRANT EXECUTE ON FUNCTION public.rpc_set_call_room_name(uuid,text) TO authenticated;

COMMIT;
