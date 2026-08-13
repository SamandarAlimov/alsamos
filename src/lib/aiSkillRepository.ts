import { supabase } from '@/integrations/supabase/client';

export type AISkillScope = 'global' | 'chat' | 'project';
export interface AISkillBinding { skillId: string; chatId: string | null; projectId: string | null; enabled: boolean; }

const fromRow = (row: any): AISkillBinding => ({
  skillId: row.skill_id,
  chatId: row.chat_id ?? null,
  projectId: row.project_id ?? null,
  enabled: Boolean(row.enabled),
});

export const aiSkillRepository = {
  async enabledSkillIds(scope: AISkillScope = 'global', contextId?: string): Promise<string[]> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [];

    let query = supabase
      .from('ai_user_skills')
      .select('skill_id')
      .eq('owner_id', auth.user.id)
      .eq('enabled', true);

    if (scope === 'chat') query = query.eq('chat_id', contextId ?? '');
    else if (scope === 'project') query = query.eq('project_id', contextId ?? '');
    else query = query.is('chat_id', null).is('project_id', null);

    const { data, error } = await query;
    if (error) throw new Error(error.message || 'AI skill state could not be loaded');
    return [...new Set((data ?? []).map((row: any) => row.skill_id).filter(Boolean))];
  },

  /** Resolve global -> project -> chat skill precedence for one conversation. */
  async effectiveSkillIds(chatId?: string, projectId?: string): Promise<string[]> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [];

    const { data, error } = await supabase
      .from('ai_user_skills')
      .select('skill_id, chat_id, project_id, enabled')
      .eq('owner_id', auth.user.id);
    if (error) throw new Error(error.message || 'AI skill state could not be loaded');

    const rows = (data ?? []).map(fromRow);
    const effective = new Map<string, boolean>();

    for (const row of rows) {
      if (row.chatId == null && row.projectId == null) effective.set(row.skillId, row.enabled);
    }
    if (projectId) {
      for (const row of rows) {
        if (row.projectId === projectId && row.chatId == null) effective.set(row.skillId, row.enabled);
      }
    }
    if (chatId) {
      for (const row of rows) {
        if (row.chatId === chatId) effective.set(row.skillId, row.enabled);
      }
    }

    return [...effective.entries()].filter(([, enabled]) => enabled).map(([skillId]) => skillId);
  },
};
