import { supabase } from '@/integrations/supabase/client';
import type { AIArtifact, AIProject, AIConnector, AISkill, AIAgentTask } from './aiWorkspaceArchitecture';

const projectFromRow = (r: any): AIProject => ({ id: r.id, ownerId: r.owner_id, name: r.name, icon: r.icon ?? undefined, color: r.color ?? undefined, instructions: r.instructions ?? undefined, createdAt: r.created_at, updatedAt: r.updated_at });
const artifactFromRow = (r: any): AIArtifact => ({ id: r.id, ownerId: r.owner_id, conversationId: r.conversation_id ?? undefined, projectId: r.project_id ?? undefined, type: r.type, title: r.title, version: r.version, mimeType: r.mime_type, storagePath: r.storage_path ?? undefined, previewUrl: r.preview_url ?? undefined, createdAt: r.created_at, updatedAt: r.updated_at });
const connectorFromRow = (r: any): AIConnector => ({ id: r.id, ownerId: r.owner_id, kind: r.kind, displayName: r.display_name, connected: r.connected, accountLabel: r.account_label ?? undefined, updatedAt: r.updated_at });
const taskFromRow = (r: any): AIAgentTask => ({ id: r.id, conversationId: r.conversation_id, title: r.title, status: r.status, steps: Array.isArray(r.steps) ? r.steps : [], requiresConfirmation: r.requires_confirmation, createdAt: r.created_at, updatedAt: r.updated_at });

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message || 'Authentication check failed');
  if (!data.user) throw new Error('Authentication required');
  return data.user.id;
}

function assertOk(error: { message?: string } | null): void {
  if (error) throw new Error(error.message || 'AI workspace request failed');
}

export const aiWorkspaceRepository = {
  async listProjects(): Promise<AIProject[]> {
    const ownerId = await requireUserId();
    const { data, error } = await supabase.from('ai_projects').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false });
    assertOk(error);
    return (data ?? []).map(projectFromRow);
  },

  async getProject(id: string): Promise<AIProject | null> {
    const ownerId = await requireUserId();
    const { data, error } = await supabase.from('ai_projects').select('*').eq('id', id).eq('owner_id', ownerId).maybeSingle();
    assertOk(error);
    return data ? projectFromRow(data) : null;
  },

  async createProject(input: Pick<AIProject, 'name'> & Partial<Pick<AIProject, 'icon' | 'color' | 'instructions'>>): Promise<AIProject> {
    const ownerId = await requireUserId();
    const name = input.name.trim();
    if (!name) throw new Error('Project name is required');
    const { data, error } = await supabase.from('ai_projects').insert({ owner_id: ownerId, name, icon: input.icon ?? null, color: input.color ?? null, instructions: input.instructions ?? null }).select().single();
    assertOk(error);
    return projectFromRow(data);
  },

  async updateProject(id: string, patch: Partial<Pick<AIProject, 'name' | 'icon' | 'color' | 'instructions'>>): Promise<AIProject> {
    const ownerId = await requireUserId();
    const updates: Record<string, unknown> = {};
    if (patch.name !== undefined) {
      const name = patch.name.trim();
      if (!name) throw new Error('Project name is required');
      updates.name = name;
    }
    if (patch.icon !== undefined) updates.icon = patch.icon;
    if (patch.color !== undefined) updates.color = patch.color;
    if (patch.instructions !== undefined) updates.instructions = patch.instructions;
    const { data, error } = await supabase.from('ai_projects').update(updates).eq('id', id).eq('owner_id', ownerId).select().single();
    assertOk(error);
    return projectFromRow(data);
  },

  async deleteProject(id: string): Promise<void> {
    const ownerId = await requireUserId();
    const { error } = await supabase.from('ai_projects').delete().eq('id', id).eq('owner_id', ownerId);
    assertOk(error);
  },

  async listArtifacts(projectId?: string): Promise<AIArtifact[]> {
    const ownerId = await requireUserId();
    let q = supabase.from('ai_artifacts').select('*').eq('owner_id', ownerId).order('updated_at', { ascending: false });
    if (projectId) q = q.eq('project_id', projectId);
    const { data, error } = await q;
    assertOk(error);
    return (data ?? []).map(artifactFromRow);
  },

  async createArtifact(input: Omit<AIArtifact, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Promise<AIArtifact> {
    const ownerId = await requireUserId();
    const { data, error } = await supabase.from('ai_artifacts').insert({
      owner_id: ownerId,
      conversation_id: input.conversationId ?? null,
      project_id: input.projectId ?? null,
      type: input.type,
      title: input.title.trim(),
      version: input.version ?? 1,
      mime_type: input.mimeType,
      storage_path: input.storagePath ?? null,
      preview_url: input.previewUrl ?? null,
    }).select().single();
    assertOk(error);
    return artifactFromRow(data);
  },

  async deleteArtifact(id: string): Promise<void> {
    const ownerId = await requireUserId();
    const { error } = await supabase.from('ai_artifacts').delete().eq('id', id).eq('owner_id', ownerId);
    assertOk(error);
  },

  async listConnectors(): Promise<AIConnector[]> {
    const ownerId = await requireUserId();
    const { data, error } = await supabase.from('ai_connectors').select('*').eq('owner_id', ownerId).order('display_name');
    assertOk(error);
    return (data ?? []).map(connectorFromRow);
  },

  async setConnectorState(id: string, connected: boolean, accountLabel?: string): Promise<AIConnector> {
    const ownerId = await requireUserId();
    const updates: Record<string, unknown> = { connected };
    if (accountLabel !== undefined) updates.account_label = accountLabel;
    const { data, error } = await supabase.from('ai_connectors').update(updates).eq('id', id).eq('owner_id', ownerId).select().single();
    assertOk(error);
    return connectorFromRow(data);
  },

  async listSkills(): Promise<AISkill[]> {
    const { data, error } = await supabase.from('ai_skills').select('*').order('name');
    assertOk(error);
    return (data ?? []) as AISkill[];
  },

  async setSkillEnabled(skillId: string, enabled: boolean, scope: 'global' | 'chat' | 'project', contextId?: string): Promise<void> {
    const ownerId = await requireUserId();
    const chatId = scope === 'chat' ? contextId ?? null : null;
    const projectId = scope === 'project' ? contextId ?? null : null;
    if ((scope === 'chat' || scope === 'project') && !contextId) throw new Error(`${scope} scope requires contextId`);
    let q = supabase.from('ai_user_skills').select('id').eq('owner_id', ownerId).eq('skill_id', skillId);
    q = chatId ? q.eq('chat_id', chatId) : q.is('chat_id', null);
    q = projectId ? q.eq('project_id', projectId) : q.is('project_id', null);
    const { data: existing, error: findError } = await q.maybeSingle();
    assertOk(findError);
    if (existing?.id) {
      const { error } = await supabase.from('ai_user_skills').update({ enabled }).eq('id', existing.id).eq('owner_id', ownerId);
      assertOk(error);
      return;
    }
    const { error } = await supabase.from('ai_user_skills').insert({ owner_id: ownerId, skill_id: skillId, chat_id: chatId, project_id: projectId, enabled });
    assertOk(error);
  },

  async listTasks(conversationId?: string): Promise<AIAgentTask[]> {
    const ownerId = await requireUserId();
    let q = supabase.from('ai_tasks').select('*').eq('owner_id', ownerId).order('created_at', { ascending: false });
    if (conversationId) q = q.eq('conversation_id', conversationId);
    const { data, error } = await q;
    assertOk(error);
    return (data ?? []).map(taskFromRow);
  },

  async getTask(id: string): Promise<AIAgentTask | null> {
    const ownerId = await requireUserId();
    const { data, error } = await supabase.from('ai_tasks').select('*').eq('id', id).eq('owner_id', ownerId).maybeSingle();
    assertOk(error);
    return data ? taskFromRow(data) : null;
  },
};