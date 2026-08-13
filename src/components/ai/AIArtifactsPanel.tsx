import { useEffect, useMemo, useState } from 'react';
import { FileCode2, FileImage, FileSpreadsheet, FileText, FileType2, Search, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { aiWorkspaceRepository } from '@/lib/aiWorkspaceRepository';
import type { AIArtifact } from '@/lib/aiWorkspaceArchitecture';

const iconFor = (type: string) => type.includes('image') ? FileImage : type.includes('spreadsheet') ? FileSpreadsheet : type.includes('code') ? FileCode2 : type.includes('document') ? FileText : FileType2;

export function AIArtifactsPanel({ projectId }: { projectId?: string }) {
  const [artifacts, setArtifacts] = useState<AIArtifact[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let alive = true; setLoading(true); setError(null); void aiWorkspaceRepository.listArtifacts(projectId).then((items) => { if (alive) setArtifacts(items); }).catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Artifacts yuklanmadi'); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, [projectId]);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return q ? artifacts.filter((a) => `${a.title} ${a.type} ${a.mimeType}`.toLowerCase().includes(q)) : artifacts; }, [artifacts, query]);
  return <div className="p-4 space-y-4"><div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Artifacts</h2><p className="text-xs text-muted-foreground">AI yaratgan fayllar va standalone natijalar.</p></div><div className="relative w-56"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search artifacts..." className="pl-8 h-8 text-xs" /></div></div>{error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</div>}{loading ? <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />)}</div> : filtered.length === 0 ? <div className="rounded-xl border border-dashed border-border p-10 text-center"><FileType2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm font-medium">No artifacts</p><p className="text-xs text-muted-foreground mt-1">Yaratilgan fayllar shu yerda ko‘rinadi.</p></div> : <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{filtered.map((artifact) => { const Icon = iconFor(artifact.type); return <div key={artifact.id} className="group rounded-xl border border-border/50 overflow-hidden hover:bg-muted/30"><div className="h-24 bg-muted/30 flex items-center justify-center">{artifact.previewUrl ? <img src={artifact.previewUrl} alt="" className="h-full w-full object-cover" loading="lazy" /> : <Icon className="h-9 w-9 text-muted-foreground" />}</div><div className="p-2.5"><p className="text-xs font-medium truncate">{artifact.title}</p><p className="text-[10px] text-muted-foreground mt-0.5">v{artifact.version} · {artifact.mimeType}</p>{artifact.previewUrl && <Button asChild variant="ghost" size="sm" className="mt-1 h-6 px-1.5 text-[10px]"><a href={artifact.previewUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3 mr-1" /> Open</a></Button>}</div></div>; })}</div>}</div>;
}
