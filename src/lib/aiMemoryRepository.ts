import { supabase } from '@/integrations/supabase/client';

export type AIMemoryCategory = 'general' | 'preference' | 'profile' | 'work' | 'project' | 'instruction';
export type AIMemorySource = 'user' | 'ai' | 'imported';

export interface AIMemory {
  id: string;
  ownerId: string;
  key: string;
  value: string;
  category: AIMemoryCategory;
  source: AIMemorySource;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

const fromRow = (row: any): AIMemory => ({
  id: row.id,
  ownerId: row.owner_id,
  key: row.memory_key,
  value: row.memory_value,
  category: row.category,
  source: row.source,
  enabled: row.enabled,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const assertOk = (error: { message?: string } | null) => {
  if (error) throw new Error(error.message || 'AI memory request failed');
};

export const aiMemoryRepository = {
  async list(): Promise<AIMemory[]> {
    const { data, error } = await supabase
      .from('ai_memories')
      .select('*')
      .order('updated_at', { ascending: false });
    assertOk(error);
    return (data ?? []).map(fromRow);
  },

  async create(input: Pick<AIMemory, 'key' | 'value'> & Partial<Pick<AIMemory, 'category' | 'source' | 'enabled'>>): Promise<AIMemory> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error('Authentication required');
    const { data, error } = await supabase
      .from('ai_memories')
      .upsert({
        owner_id: auth.user.id,
        memory_key: input.key.trim(),
        memory_value: input.value.trim(),
        category: input.category ?? 'general',
        source: input.source ?? 'user',
        enabled: input.enabled ?? true,
      }, { onConflict: 'owner_id,memory_key' })
      .select()
      .single();
    assertOk(error);
    return fromRow(data);
  },

  async update(id: string, patch: Partial<Pick<AIMemory, 'key' | 'value' | 'category' | 'enabled'>>): Promise<AIMemory> {
    const updates: Record<string, unknown> = {};
    if (patch.key !== undefined) updates.memory_key = patch.key.trim();
    if (patch.value !== undefined) updates.memory_value = patch.value.trim();
    if (patch.category !== undefined) updates.category = patch.category;
    if (patch.enabled !== undefined) updates.enabled = patch.enabled;
    const { data, error } = await supabase
      .from('ai_memories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    assertOk(error);
    return fromRow(data);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('ai_memories').delete().eq('id', id);
    assertOk(error);
  },

  async enabledContext(limit = 30): Promise<string[]> {
    const { data, error } = await supabase
      .from('ai_memories')
      .select('memory_key,memory_value')
      .eq('enabled', true)
      .order('updated_at', { ascending: false })
      .limit(limit);
    assertOk(error);
    return (data ?? []).map((row: any) => `${row.memory_key}: ${row.memory_value}`);
  },
};
