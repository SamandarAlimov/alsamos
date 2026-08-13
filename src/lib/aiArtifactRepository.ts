import { supabase } from '@/integrations/supabase/client';
import type { AIArtifact } from '@/lib/aiArtifacts';

export type PersistedAIArtifact = AIArtifact & {
  ownerId: string;
  conversationId?: string | null;
  projectId?: string | null;
  version: number;
  storageUrl?: string | null;
};

export type AIArtifactVersion = PersistedAIArtifact & {
  artifactId: string;
};

const mapArtifact = (row: any): PersistedAIArtifact => ({
  id: row.id,
  messageId: row.message_id ?? '',
  kind: row.kind,
  title: row.title,
  language: row.language ?? undefined,
  content: row.content ?? row.storage_url ?? '',
  createdAt: new Date(row.created_at),
  ownerId: row.owner_id,
  conversationId: row.conversation_id,
  projectId: row.project_id,
  version: Number(row.version ?? 1),
  storageUrl: row.storage_url,
});

const mapVersion = (row: any): AIArtifactVersion => ({
  id: row.id,
  artifactId: row.artifact_id,
  messageId: row.message_id ?? '',
  kind: row.kind,
  title: row.title,
  language: row.language ?? undefined,
  content: row.content ?? row.storage_url ?? '',
  createdAt: new Date(row.created_at),
  ownerId: row.owner_id,
  conversationId: row.conversation_id,
  projectId: row.project_id,
  version: Number(row.version ?? 1),
  storageUrl: row.storage_url,
});

function rowFromArtifact(ownerId: string, artifact: AIArtifact, conversationId?: string | null, projectId?: string | null) {
  return {
    owner_id: ownerId,
    conversation_id: conversationId ?? null,
    message_id: artifact.messageId,
    project_id: projectId ?? null,
    kind: artifact.kind,
    title: artifact.title,
    language: artifact.language ?? null,
    content: artifact.content,
    metadata: { source: 'assistant_message', artifact_id: artifact.id },
  };
}

async function currentOwnerId() {
  const { data: session } = await supabase.auth.getSession();
  return session.session?.user.id ?? null;
}

export const aiArtifactRepository = {
  async list(conversationId?: string, projectId?: string): Promise<PersistedAIArtifact[]> {
    let query = supabase.from('ai_artifacts').select('*').order('updated_at', { ascending: false });
    if (conversationId) query = query.eq('conversation_id', conversationId);
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapArtifact);
  },

  async history(artifactId: string): Promise<AIArtifactVersion[]> {
    const ownerId = await currentOwnerId();
    if (!ownerId) return [];
    const { data, error } = await supabase
      .from('ai_artifact_versions')
      .select('*')
      .eq('artifact_id', artifactId)
      .eq('owner_id', ownerId)
      .order('version', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapVersion);
  },

  async getVersion(artifactId: string, version: number): Promise<AIArtifactVersion | null> {
    const ownerId = await currentOwnerId();
    if (!ownerId) return null;
    const { data, error } = await supabase
      .from('ai_artifact_versions')
      .select('*')
      .eq('artifact_id', artifactId)
      .eq('owner_id', ownerId)
      .eq('version', version)
      .maybeSingle();
    if (error) throw error;
    return data ? mapVersion(data) : null;
  },

  async createVersion(artifactId: string, source: PersistedAIArtifact): Promise<number> {
    const ownerId = await currentOwnerId();
    if (!ownerId) throw new Error('Authentication required');
    const { data: current, error: currentError } = await supabase
      .from('ai_artifacts')
      .select('version')
      .eq('id', artifactId)
      .eq('owner_id', ownerId)
      .single();
    if (currentError) throw currentError;

    const nextVersion = Number(current.version ?? 0) + 1;
    const { error } = await supabase.from('ai_artifact_versions').insert({
      artifact_id: artifactId,
      owner_id: ownerId,
      version: nextVersion,
      kind: source.kind,
      title: source.title,
      language: source.language ?? null,
      content: source.content,
      storage_url: source.storageUrl ?? null,
      metadata: { source: 'artifact_update' },
    });
    if (error) throw error;
    return nextVersion;
  },

  async upsertFromMessage(artifact: AIArtifact, conversationId?: string | null, projectId?: string | null): Promise<string | null> {
    const ownerId = await currentOwnerId();
    if (!ownerId) return null;

    const payload = rowFromArtifact(ownerId, artifact, conversationId, projectId);
    const existingQuery = supabase
      .from('ai_artifacts')
      .select('id, version, content')
      .eq('owner_id', ownerId)
      .eq('message_id', artifact.messageId)
      .eq('kind', artifact.kind)
      .eq('title', artifact.title);
    const { data: existing } = conversationId
      ? await existingQuery.eq('conversation_id', conversationId).maybeSingle()
      : await existingQuery.is('conversation_id', null).maybeSingle();

    if (existing?.id) {
      if (existing.content === payload.content) return existing.id;
      const nextVersion = Number(existing.version ?? 0) + 1;
      const { error: snapshotError } = await supabase.from('ai_artifact_versions').insert({
        artifact_id: existing.id,
        owner_id: ownerId,
        version: nextVersion,
        kind: payload.kind,
        title: payload.title,
        language: payload.language,
        content: payload.content,
        storage_url: null,
        metadata: payload.metadata,
      });
      if (snapshotError) throw snapshotError;
      const { error } = await supabase
        .from('ai_artifacts')
        .update({ content: payload.content, language: payload.language, metadata: payload.metadata, version: nextVersion })
        .eq('id', existing.id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return existing.id;
    }

    const { data, error } = await supabase.from('ai_artifacts').insert({ ...payload, version: 1 }).select('id').single();
    if (error) throw error;
    if (data?.id) {
      const { error: snapshotError } = await supabase.from('ai_artifact_versions').insert({
        artifact_id: data.id,
        owner_id: ownerId,
        version: 1,
        kind: payload.kind,
        title: payload.title,
        language: payload.language,
        content: payload.content,
        storage_url: null,
        metadata: payload.metadata,
      });
      if (snapshotError) throw snapshotError;
    }
    return data?.id ?? null;
  },
};