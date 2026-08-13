-- AI long-term context regression scenarios.
-- Run in a disposable Postgres/Supabase test database after applying the AI migrations.

DO $$
DECLARE
  generated text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'ai_conversation_title_from_messages'
  ) THEN
    RAISE EXCEPTION 'ai_conversation_title_from_messages is missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    WHERE proname = 'set_ai_conversation_metadata'
  ) THEN
    RAISE EXCEPTION 'set_ai_conversation_metadata is missing';
  END IF;

  generated := public.ai_conversation_title_from_messages(
    '[{"role":"assistant","content":"old"},{"role":"user","content":"Build a professional Alsamos AI workspace"}]'::jsonb
  );

  IF generated <> 'Build a professional Alsamos AI workspace' THEN
    RAISE EXCEPTION 'unexpected generated title: %', generated;
  END IF;
END $$;

-- Verify the trigger behavior independently from auth/RLS by using a disposable table.
CREATE TEMP TABLE ai_title_guard_test (
  messages jsonb,
  title text,
  updated_at timestamptz
);

CREATE TRIGGER ai_title_guard_test_trigger
BEFORE INSERT OR UPDATE OF messages, title ON ai_title_guard_test
FOR EACH ROW EXECUTE FUNCTION public.set_ai_conversation_metadata();

INSERT INTO ai_title_guard_test(messages, title, updated_at)
VALUES (
  '[{"role":"user","content":"Original request"}]'::jsonb,
  'My custom title',
  now()
);

UPDATE ai_title_guard_test
SET messages = '[{"role":"user","content":"Original request"},{"role":"assistant","content":"response"}]'::jsonb,
    title = 'Original request';

IF (SELECT title FROM ai_title_guard_test) <> 'My custom title' THEN
  RAISE EXCEPTION 'custom title was overwritten by automatic persistence';
END IF;

UPDATE ai_title_guard_test
SET title = 'Renamed by user';

IF (SELECT title FROM ai_title_guard_test) <> 'Renamed by user' THEN
  RAISE EXCEPTION 'explicit rename was not persisted';
END IF;

DROP TABLE ai_title_guard_test;
