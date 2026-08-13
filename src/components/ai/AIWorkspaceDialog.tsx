import { useState } from 'react';
import { X, FolderKanban, Package, PlugZap, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIProjectsPanel } from './AIProjectsPanel';

type WorkspaceKey = 'projects' | 'artifacts' | 'connectors' | 'skills';

export function AIWorkspaceDialog({ open, section, onClose }: { open: boolean; section: WorkspaceKey; onClose: () => void }) {
  const [active, setActive] = useState<WorkspaceKey>(section);
  if (!open) return null;
  const items = [
    { key: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { key: 'artifacts' as const, label: 'Artifacts', icon: Package },
    { key: 'connectors' as const, label: 'Connectors', icon: PlugZap },
    { key: 'skills' as const, label: 'Plugins / Skills', icon: Wrench },
  ];
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="AI Workspace">
    <button className="absolute inset-0 bg-background/75 backdrop-blur-sm" onClick={onClose} aria-label="Close workspace" />
    <div className="relative flex h-[min(720px,90vh)] w-full max-w-5xl overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl">
      <aside className="w-52 shrink-0 border-r border-border/50 bg-muted/20 p-3"><div className="flex items-center justify-between px-2 pb-3"><span className="text-sm font-semibold">AI Workspace</span><Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClose}><X className="h-4 w-4" /></Button></div><div className="space-y-1">{items.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setActive(key)} className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${active === key ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div></aside>
      <main className="min-w-0 flex-1 overflow-auto">{active === 'projects' ? <AIProjectsPanel /> : <div className="flex h-full items-center justify-center p-8 text-center"><div><p className="text-sm font-medium">{items.find((x) => x.key === active)?.label}</p><p className="mt-1 text-xs text-muted-foreground">Bu workspace modulining persistence va UI qatlami keyingi bosqichda ulanadi.</p></div></div>}</main>
    </div>
  </div>;
}
