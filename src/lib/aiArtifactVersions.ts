import { supabase } from '@/lib/supabase';

export interface AIArtifactVersion {
  id: string;
  artifactId: string;
  version: number;
  ownerId: string;
  title: string;
  mimeType: string;
  storagePath?: string;
  previewUrl?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

const fromRow = (r: any): AIArtifactVersion => ({
  id: r.id,
  artifactId: r.artifact_id,
  version: r.version,
  ownerId: r.owner_id,
  title: r.title,
  mimeType: r.mime_type,
  storagePath: r.storage_path ?? undefined,
  previewUrl: r.preview_url ?? undefined,
  metadata: r.metadata ?? {},
  createdAt: r.created_at,
});

export const aiArtifactVersions = {
  async list(artifactId: string): Promise<AIArtifactVersion[]> {
    const { data, error } = await supabase
      .from('ai_artifact_versions')
      .select('*')
      .eq('artifact_id', artifactId)
      .order('version', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(fromRow);
  },
  async get(artifactId: string, version: number): Promise<AIArtifactVersion | null> {
    const { data, error } = await supabase
      .from('ai_artifact_versions')
      .select('*')
      .eq('artifact_id', artifactId)
      .eq('version', version)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? fromRow(data) : null;
  },
};
