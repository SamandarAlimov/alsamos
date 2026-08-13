import { useState } from 'react';
import { Download, ExternalLink, FileCode2, FileImage, FileSpreadsheet, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AIArtifact } from '@/lib/aiWorkspaceArchitecture';

const isImage = (a: AIArtifact) => a.type === 'image' || a.mimeType.startsWith('image/');
const iconFor = (a: AIArtifact) => isImage(a) ? FileImage : a.type === 'spreadsheet' ? FileSpreadsheet : a.type === 'code' ? FileCode2 : FileText;

export function AIArtifactViewer({ artifact, onClose }: { artifact: AIArtifact; onClose: () => void }) {
  const [version, setVersion] = useState(artifact.version);
  const Icon = iconFor(artifact);
  const openArtifact = () => artifact.previewUrl && window.open(artifact.previewUrl, '_blank', 'noopener,noreferrer');
  return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={artifact.title}>
    <div className="flex h-[min(820px,94vh)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
      <header className="flex items-center gap-3 border-b border-border/50 px-4 py-3"><Icon className="h-5 w-5 text-muted-foreground" /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{artifact.title}</h2><p className="text-[10px] text-muted-foreground">{artifact.mimeType} · v{version}</p></div><Button size="sm" variant="ghost" disabled={!artifact.previewUrl} onClick={openArtifact}><Download className="mr-1.5 h-3.5 w-3.5" />Open / Download</Button>{artifact.previewUrl && <Button size="icon" variant="ghost" onClick={openArtifact}><ExternalLink className="h-4 w-4" /></Button>}<Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button></header>
      <div className="flex min-h-0 flex-1">{isImage(artifact) && artifact.previewUrl ? <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/20 p-6"><img src={artifact.previewUrl} alt={artifact.title} className="max-h-full max-w-full rounded-lg object-contain shadow-sm" /></div> : artifact.previewUrl ? <iframe title={artifact.title} src={artifact.previewUrl} className="h-full w-full border-0 bg-background" /> : <div className="flex flex-1 flex-col items-center justify-center p-10 text-center"><Icon className="mb-3 h-10 w-10 text-muted-foreground" /><p className="text-sm font-medium">Preview mavjud emas</p><p className="mt-1 max-w-sm text-xs text-muted-foreground">Artifact storage URL yoki viewer-ready preview hali biriktirilmagan.</p></div>}</div>
      <footer className="flex items-center justify-between border-t border-border/50 px-4 py-2"><p className="text-[10px] text-muted-foreground">Version history</p><div className="flex items-center gap-1"><Button size="sm" variant="outline" className="h-7 text-[10px]" disabled={version <= 1} onClick={() => setVersion((v) => v - 1)}>Previous</Button><span className="px-2 text-[10px] text-muted-foreground">v{version}</span><Button size="sm" variant="outline" className="h-7 text-[10px]" disabled={version >= artifact.version} onClick={() => setVersion((v) => v + 1)}>Next</Button></div></footer>
    </div>
  </div>;
}
