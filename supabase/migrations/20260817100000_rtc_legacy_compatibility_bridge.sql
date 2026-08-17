BEGIN;

-- RTC compatibility bridge.
-- The 2026-08-12 canonical migration renamed video_calls -> calls, while the
-- currently deployed web client still uses video_calls for call creation,
-- status realtime and call-type discovery. Keep both contracts synchronized
-- so the proven P2P WebRTC client can operate without reverting the canonical
-- calls schema.

CREATE TABLE IF NOT EXISTS public.video_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  host_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  call_type text NOT NULL DEFAULT 'video' CHECK (call_type IN ('audio','video')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('waiting','active','ended','declined','missed','ringing')),
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  max_participants integer NOT NULL DEFAULT 2
);

CREATE INDEX IF NOT EXISTS video_calls_conversation_idx ON public.video_calls(conversation_id);
CREATE INDEX IF NOT EXISTS video_calls_host_idx ON public.video_calls(host_id);
CREATE INDEX IF NOT EXISTS video_calls_status_idx ON public.video_calls(status);

ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "rtc_legacy_video_calls_select" ON public.video_calls;
DROP POLICY IF EXISTS "rtc_legacy_video_calls_insert" ON public.video_calls;
DROP POLICY IF EXISTS "rtc_legacy_video_calls_update" ON public.video_calls;
DROP POLICY IF EXISTS "rtc_legacy_video_calls_delete" ON public.video_calls;

CREATE POLICY "rtc_legacy_video_calls_select" ON public.video_calls
FOR SELECT TO authenticated
USING (
  host_id = auth.uid()
  OR (conversation_id IS NOT NULL AND public.is_conversation_participant(conversation_id, auth.uid()))
);

CREATE POLICY "rtc_legacy_video_calls_insert" ON public.video_calls
FOR INSERT TO authenticated
WITH CHECK (host_id = auth.uid());

CREATE POLICY "rtc_legacy_video_calls_update" ON public.video_calls
FOR UPDATE TO authenticated
USING (
  host_id = auth.uid()
  OR (conversation_id IS NOT NULL AND public.is_conversation_participant(conversation_id, auth.uid()))
)
WITH CHECK (
  host_id = auth.uid()
  OR (conversation_id IS NOT NULL AND public.is_conversation_participant(conversation_id, auth.uid()))
);

CREATE POLICY "rtc_legacy_video_calls_delete" ON public.video_calls
FOR DELETE TO authenticated
USING (host_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_video_call_to_canonical()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.calls(
      id, type, host_id, conversation_id, status, media_backend,
      max_participants, started_at, ended_at, metadata
    )
    VALUES(
      NEW.id,
      'direct',
      NEW.host_id,
      NEW.conversation_id,
      CASE WHEN NEW.status = 'waiting' THEN 'ringing' ELSE NEW.status END,
      'p2p',
      GREATEST(2, COALESCE(NEW.max_participants, 2)),
      NEW.started_at,
      NEW.ended_at,
      jsonb_build_object('legacy_bridge', true, 'call_type', NEW.call_type)
    )
    ON CONFLICT (id) DO UPDATE SET
      host_id = EXCLUDED.host_id,
      conversation_id = EXCLUDED.conversation_id,
      status = EXCLUDED.status,
      started_at = EXCLUDED.started_at,
      ended_at = EXCLUDED.ended_at,
      max_participants = EXCLUDED.max_participants,
      metadata = COALESCE(public.calls.metadata, '{}'::jsonb) || EXCLUDED.metadata;

    INSERT INTO public.call_participants(
      call_id, user_id, role, connection_status, is_video_on
    )
    VALUES(
      NEW.id, NEW.host_id, 'host', 'disconnected', NEW.call_type = 'video'
    )
    ON CONFLICT (call_id, user_id) DO UPDATE SET
      is_video_on = EXCLUDED.is_video_on;

    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    UPDATE public.calls
    SET
      conversation_id = NEW.conversation_id,
      status = CASE WHEN NEW.status = 'waiting' THEN 'ringing' ELSE NEW.status END,
      started_at = NEW.started_at,
      ended_at = NEW.ended_at,
      max_participants = GREATEST(2, COALESCE(NEW.max_participants, 2)),
      metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object('call_type', NEW.call_type)
    WHERE id = NEW.id;

    RETURN NEW;
  END IF;

  DELETE FROM public.calls WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_video_calls_to_calls ON public.video_calls;
CREATE TRIGGER trg_video_calls_to_calls
AFTER INSERT OR UPDATE OR DELETE ON public.video_calls
FOR EACH ROW
EXECUTE FUNCTION public.sync_video_call_to_canonical();

CREATE OR REPLACE FUNCTION public.sync_canonical_call_to_video()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_call_type text;
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  v_call_type := COALESCE(
    NEW.metadata ->> 'call_type',
    CASE WHEN NEW.type = 'direct' THEN 'video' ELSE 'video' END
  );

  INSERT INTO public.video_calls(
    id, conversation_id, host_id, call_type, status,
    started_at, ended_at, max_participants
  )
  VALUES(
    NEW.id, NEW.conversation_id, NEW.host_id, v_call_type, NEW.status,
    NEW.started_at, NEW.ended_at, NEW.max_participants
  )
  ON CONFLICT (id) DO UPDATE SET
    conversation_id = EXCLUDED.conversation_id,
    host_id = EXCLUDED.host_id,
    call_type = EXCLUDED.call_type,
    status = EXCLUDED.status,
    started_at = EXCLUDED.started_at,
    ended_at = EXCLUDED.ended_at,
    max_participants = EXCLUDED.max_participants;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_calls_to_video_calls ON public.calls;
CREATE TRIGGER trg_calls_to_video_calls
AFTER INSERT OR UPDATE ON public.calls
FOR EACH ROW
EXECUTE FUNCTION public.sync_canonical_call_to_video();

COMMIT;
