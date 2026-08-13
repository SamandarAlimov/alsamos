import { supabase } from '@/integrations/supabase/client';

export const aiSkillRepository = {
  async enabledSkillIds(scope: 'global' | 'chat' | 'project' = 'global', contextId?: string): Promise<string[]> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return [];

    let query = supabase
      .from('ai_user_skills')
      .select('skill_id')
      .eq('owner_id', auth.user.id)
      .eq('enabled', true);

    if (scope === 'chat') {
      query = query.eq('chat_id', contextId ?? '');
    } else if (scope === 'project') {
      query = query.eq('project_id', contextId ?? '');
    } else {
      query = query.is('chat_id', null).is('project_id', null);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message || 'AI skill state could not be loaded');
    return [...new Set((data ?? []).map((row: any) => row.skill_id).filter(Boolean))];
  },
};
