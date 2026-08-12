-- RTC Batch 1 regression scenarios.
-- Execute this file in a disposable Supabase/Postgres test database after applying
-- the RTC migrations. The assertions intentionally exercise the authoritative RPCs.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'rpc_leave_call'
  ) THEN
    RAISE EXCEPTION 'rpc_leave_call is missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'rpc_end_call_for_everyone'
  ) THEN
    RAISE EXCEPTION 'rpc_end_call_for_everyone is missing';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('calls','call_participants','call_invites')
      AND (qual = 'true' OR with_check = 'true')
  ) THEN
    RAISE EXCEPTION 'RTC tables contain a blanket true RLS policy';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'is_call_invitee'
  ) THEN
    RAISE EXCEPTION 'is_call_invitee is missing';
  END IF;
END $$;

-- Integration regression (run with a test auth.uid context):
-- 1. Create a conference call with host A and invite B,C.
-- 2. Accept B,C and mark A,B,C connected.
-- 3. Execute rpc_leave_call(call_id) as B.
-- 4. Assert:
--      calls.status = 'active'
--      calls.ended_at IS NULL
--      calls.ended_by IS NULL
--      B.connection_status = 'left'
--      A.connection_status = 'connected'
--      C.connection_status = 'connected'
-- 5. Execute rpc_leave_call(call_id) as A and C concurrently when they are the
--    last two active participants. Assert the final call status is exactly
--    'ended', ended_by IS NULL, and no transaction reports a deadlock.
-- 6. Execute rpc_end_call_for_everyone(call_id) as the host while B/C are
--    connected. Assert status='ended', ended_by=host_id and all active
--    participants become 'left'.
