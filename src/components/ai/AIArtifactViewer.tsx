import { useEffect, useState } from 'react';
import { Download, ExternalLink, FileCode2, FileImage, FileSpreadsheet, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AIArtifact } from '@/lib/aiWorkspaceArchitecture';
import { aiArtifactVersions, type AIArtifactVersion } from '@/lib/aiArtifactVersions';

const isImage = (a: Pick<AIArtifact, 'type' | 'mimeType'>) => a.type === 'image' || a.mimeType.startsWith('image/');
const iconFor = (a: Pick<AIArtifact, 'type' | 'mimeType'>) => isImage(a) ? FileImage : a.type === 'spreadsheet' ? FileSpreadsheet : a.type === 'code' ? FileCode2 : FileText;

export function AIArtifactViewer({ artifact, onClose }: { artifact: AIArtifact; onClose: () => void }) {
  const [versions, setVersions] = useState<AIArtifactVersion[]>([]);
  const [selected, setSelected] = useState<AIArtifactVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const current = selected ?? { version: artifact.version, title: artifact.title, mimeType: artifact.mimeType, previewUrl: artifact.previewUrl };
  const Icon = iconFor(artifact);

  useEffect(() => { let alive = true; setLoading(true); void aiArtifactVersions.list(artifact.id).then((items) => { if (!alive) return; setVersions(items); const head = items.find((v) => v.version === artifact.version); if (head) setSelected(head); }).catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Version history yuklanmadi'); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, [artifact.id, artifact.version]);
  const openArtifact = () => current.previewUrl && window.open(current.previewUrl, '_blank', 'noopener,noreferrer');

  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={artifact.title}>
    <div className="flex h-[min(820px,94vh)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
      <header className="flex items-center gap-3 border-b border-border/50 px-4 py-3"><Icon className="h-5 w-5 text-muted-foreground" /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{current.title}</h2><p className="text-[10px] text-muted-foreground">{current.mimeType} · v{current.version}</p></div><Button size="sm" variant="ghost" disabled={!current.previewUrl} onClick={openArtifact}><Download className="mr-1.5 h-3.5 w-3.5" />Open / Download</Button>{current.previewUrl && <Button size="icon" variant="ghost" onClick={openArtifact}><ExternalLink className="h-4 w-4" /></Button>}<Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></header>
      {error && <div className="border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-xs text-destructive">{error}</div>}
      <div className="flex min-h-0 flex-1"><aside className="w-48 shrink-0 overflow-auto border-r border-border/50 p-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Versions</p>{loading ? <div className="space-y-2">{[1,2,3].map((n) => <div key={n} className="h-7 rounded bg-muted animate-pulse" />)}</div> : versions.length === 0 ? <p className="text-[10px] text-muted-foreground">Version history mavjud emas.</p> : <div className="space-y-1">{versions.map((v) => <button key={v.id} type="button" onClick={() => setSelected(v)} className={`w-full rounded-md px-2 py-1.5 text-left text-xs ${current.version === v.version ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/60'}`}>v{v.version}<span className="ml-1 text-[9px]">{new Date(v.createdAt).toLocaleDateString()}</span></button>)}</div>}</aside><div className="flex min-w-0 flex-1">{isImage(artifact) && current.previewUrl ? <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/20 p-6"><img src={current.previewUrl} alt={current.title} className="max-h-full max-w-full rounded-lg object-contain shadow-sm" /></div> : current.previewUrl ? <iframe title={current.title} src={current.previewUrl} className="h-full w-full border-0 bg-background" /> : <div className="flex flex-1 flex-col items-center justify-center p-10 text-center"><Icon className="mb-3 h-10 w-10 text-muted-foreground" /><p className="text-sm font-medium">Preview mavjud emas</p><p className="mt-1 max-w-sm text-xs text-muted-foreground">Bu version uchun storage yoki preview URL biriktirilmagan.</p></div>}</div></div>
    </div>
  </div>;
}
