// Backward-compatible Supabase client entrypoint.
// New code should import from '@/integrations/supabase/client'.
// This re-export keeps legacy modules and older deployment branches buildable.
export { supabase } from '@/integrations/supabase/client';
