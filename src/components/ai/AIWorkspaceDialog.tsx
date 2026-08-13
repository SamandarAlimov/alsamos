import { useEffect, useState } from 'react';
import { X, FolderKanban, Package, PlugZap, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIProjectsPanel } from './AIProjectsPanel';
import { AIArtifactsPanel } from './AIArtifactsPanel';

type WorkspaceKey = 'projects' | 'artifacts' | 'connectors' | 'skills';
const items = [
  { key: 'projects' as const, label: 'Projects', icon: FolderKanban },
  { key: 'artifacts' as const, label: 'Artifacts', icon: Package },
  { key: 'connectors' as const, label: 'Connectors', icon: PlugZap },
  { key: 'skills' as const, label: 'Plugins / Skills', icon: Wrench },
];

export function AIWorkspaceDialog({ open, section, onClose }: { open: boolean; section: WorkspaceKey; onClose: () => void }) {
  const [active, setActive] = useState<WorkspaceKey>(section);
  useEffect(() => { if (open) setActive(section); }, [open, section]);
  useEffect(() => { if (!open) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [open]);
  if (!open) return null;
  return <div className="fixed inset-0 z-[100] flex items-stretch justify-center sm:items-center sm:p-3" role="dialog" aria-modal="true" aria-label="AI Workspace">
    <button className="absolute inset-0 hidden bg-background/75 backdrop-blur-sm sm:block" onClick={onClose} aria-label="Close workspace" />
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background sm:h-[min(760px,92vh)] sm:max-w-5xl sm:flex-row sm:rounded-2xl sm:border sm:border-border/60 sm:shadow-2xl">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 px-3 sm:hidden"><span className="text-sm font-semibold">AI Workspace</span><span className="text-xs text-muted-foreground">/ {items.find((x) => x.key === active)?.label}</span><Button size="icon" variant="ghost" className="ml-auto h-8 w-8" onClick={onClose}><X className="h-4 w-4" /></Button></header>
      <aside className="hidden w-56 shrink-0 border-r border-border/50 bg-muted/20 p-3 sm:block"><div className="flex items-center justify-between px-2 pb-3"><span className="text-sm font-semibold">AI Workspace</span><Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button></div><nav className="space-y-1">{items.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setActive(key)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-xs ${active === key ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}><Icon className="h-4 w-4" />{label}</button>)}</nav></aside>
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border/50 bg-muted/10 p-2 sm:hidden" role="tablist">{items.map(({ key, label, icon: Icon }) => <button key={key} role="tab" aria-selected={active === key} onClick={() => setActive(key)} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs ${active === key ? 'bg-muted font-medium' : 'text-muted-foreground'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">{active === 'projects' ? <AIProjectsPanel /> : active === 'artifacts' ? <AIArtifactsPanel /> : <div className="flex min-h-full items-center justify-center p-6 text-center"><div className="max-w-sm"><p className="text-sm font-medium">{items.find((x) => x.key === active)?.label}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Bu bo‘lim AI Workspace ichida alohida boshqaruv maydoni sifatida ulanadi.</p></div></div>}</main>
    </div>
  </div>;
}
