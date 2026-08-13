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

async function createTransactionalVersion(artifactId: string, content: string, language?: string | null, metadata?: Record<string, unknown>, storageUrl?: string | null) {
  const { data, error } = await supabase.rpc('ai_create_artifact_version', {
    p_artifact_id: artifactId,
    p_content: content,
    p_language: language ?? null,
    p_metadata: metadata ?? {},
    p_storage_url: storageUrl ?? null,
  });
  if (error) throw error;
  return data?.[0] as { artifact_id: string; version: number; version_id: string | null; created: boolean } | undefined;
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
    const result = await createTransactionalVersion(
      artifactId,
      source.content,
      source.language,
      { source: 'artifact_update' },
      source.storageUrl,
    );
    if (!result) throw new Error('Artifact version transaction returned no result');
    return Number(result.version);
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
    const { data: existing, error: existingError } = conversationId
      ? await existingQuery.eq('conversation_id', conversationId).maybeSingle()
      : await existingQuery.is('conversation_id', null).maybeSingle();
    if (existingError) throw existingError;

    if (existing?.id) {
      if (existing.content === payload.content) return existing.id;
      await createTransactionalVersion(
        existing.id,
        payload.content,
        payload.language,
        payload.metadata,
        null,
      );
      return existing.id;
    }

    const { data, error } = await supabase.from('ai_artifacts').insert({ ...payload, version: 1 }).select('id').single();
    if (error) throw error;
    if (!data?.id) return null;

    const { error: snapshotError } = await supabase.rpc('ai_create_artifact_version', {
      p_artifact_id: data.id,
      p_content: payload.content,
      p_language: payload.language,
      p_metadata: payload.metadata,
      p_storage_url: null,
    });
    if (snapshotError) throw snapshotError;
    return data.id;
  },
};