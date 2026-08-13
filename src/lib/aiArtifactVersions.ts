import { supabase } from '@/integrations/supabase/client';

export interface AIArtifactVersion {
  id: string;
  artifactId: string;
  version: number;
  ownerId: string;
  kind: 'code' | 'image' | 'document';
  title: string;
  language?: string;
  content: string;
  storageUrl?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

const fromRow = (r: any): AIArtifactVersion => ({
  id: r.id,
  artifactId: r.artifact_id,
  version: r.version,
  ownerId: r.owner_id,
  kind: r.kind,
  title: r.title,
  language: r.language ?? undefined,
  content: r.content ?? '',
  storageUrl: r.storage_url ?? undefined,
  metadata: r.metadata ?? {},
  createdAt: r.created_at,
});

export const aiArtifactVersions = {
  async list(artifactId: string): Promise<AIArtifactVersion[]> {
    const { data, error } = await supabase.from('ai_artifact_versions').select('*').eq('artifact_id', artifactId).order('version', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(fromRow);
  },

  async get(artifactId: string, version: number): Promise<AIArtifactVersion | null> {
    const { data, error } = await supabase.from('ai_artifact_versions').select('*').eq('artifact_id', artifactId).eq('version', version).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? fromRow(data) : null;
  },

  async restore(artifactId: string, version: number): Promise<string | null> {
    const { data, error } = await supabase.rpc('restore_ai_artifact_version', {
      p_artifact_id: artifactId,
      p_version: version,
    });
    if (error) throw new Error(error.message);
    return data ?? null;
  },
};
