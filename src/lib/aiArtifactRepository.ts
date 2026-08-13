import { supabase } from '@/integrations/supabase/client';
import type { AIArtifact } from '@/lib/aiArtifacts';

export type PersistedAIArtifact = AIArtifact & {
  ownerId: string;
  conversationId?: string | null;
  projectId?: string | null;
  version: number;
  storageUrl?: string | null;
};

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

export const aiArtifactRepository = {
  async list(conversationId?: string, projectId?: string): Promise<PersistedAIArtifact[]> {
    let query = supabase.from('ai_artifacts').select('*').order('updated_at', { ascending: false });
    if (conversationId) query = query.eq('conversation_id', conversationId);
    if (projectId) query = query.eq('project_id', projectId);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map((row: any) => ({
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
      version: row.version,
      storageUrl: row.storage_url,
    }));
  },

  async upsertFromMessage(artifact: AIArtifact, conversationId?: string | null, projectId?: string | null): Promise<string | null> {
    const { data: session } = await supabase.auth.getSession();
    const ownerId = session.session?.user.id;
    if (!ownerId) return null;

    const payload = rowFromArtifact(ownerId, artifact, conversationId, projectId);
    const { data: existing } = await supabase
      .from('ai_artifacts')
      .select('id, version, content')
      .eq('owner_id', ownerId)
      .eq('conversation_id', conversationId ?? '')
      .eq('message_id', artifact.messageId)
      .eq('kind', artifact.kind)
      .eq('title', artifact.title)
      .maybeSingle();

    if (existing?.id) {
      // Replaying the same stream event must not create a new version.
      if (existing.content === payload.content) return existing.id;
      const { error } = await supabase
        .from('ai_artifacts')
        .update({ content: payload.content, language: payload.language, metadata: payload.metadata, version: Number(existing.version) + 1 })
        .eq('id', existing.id)
        .eq('owner_id', ownerId);
      if (error) throw error;
      return existing.id;
    }

    const { data, error } = await supabase.from('ai_artifacts').insert(payload).select('id').single();
    if (error) throw error;
    return data?.id ?? null;
  },
};