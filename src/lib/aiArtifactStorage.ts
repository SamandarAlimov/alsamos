import { supabase } from '@/lib/supabase';

export const AI_ARTIFACT_BUCKET = 'ai-artifacts';

export interface AIArtifactUpload {
  file: File;
  artifactId: string;
  version: number;
}

const objectPath = (userId: string, artifactId: string, version: number, fileName: string) =>
  `${userId}/${artifactId}/v${version}/${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

export const aiArtifactStorage = {
  async upload(input: AIArtifactUpload): Promise<{ path: string }> {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error('Authentication required');
    const path = objectPath(auth.user.id, input.artifactId, input.version, input.file.name);
    const { error } = await supabase.storage.from(AI_ARTIFACT_BUCKET).upload(path, input.file, {
      upsert: false,
      contentType: input.file.type || 'application/octet-stream',
      cacheControl: '3600',
    });
    if (error) throw new Error(error.message);
    return { path };
  },
  async createSignedUrl(path: string, expiresIn = 300): Promise<string> {
    if (!path) throw new Error('Artifact storage path is required');
    const { data, error } = await supabase.storage.from(AI_ARTIFACT_BUCKET).createSignedUrl(path, expiresIn);
    if (error || !data?.signedUrl) throw new Error(error?.message || 'Could not create signed URL');
    return data.signedUrl;
  },
  async remove(path: string): Promise<void> {
    const { error } = await supabase.storage.from(AI_ARTIFACT_BUCKET).remove([path]);
    if (error) throw new Error(error.message);
  },
};
