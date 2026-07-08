export const ALSAMOS_COOKIE_DOMAIN = ".alsamos.com";
export const ALSAMOS_SUPABASE_PROJECT_ID = "mbhjganbihamoiqmankv";

export function getSupabaseAuthStorageKey(projectId = ALSAMOS_SUPABASE_PROJECT_ID): string {
  return `sb-${projectId}-auth-token`;
}

