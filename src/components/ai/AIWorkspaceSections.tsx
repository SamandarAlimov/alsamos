import { ChevronDown, ChevronRight, FolderKanban, Package, PlugZap, Wrench, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type WorkspaceKey = 'projects' | 'artifacts' | 'connectors' | 'skills';
const sections: Array<{ key: WorkspaceKey; label: string; icon: typeof FolderKanban; description: string }> = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, description: 'Loyihalar, chatlar va custom instructions' },
  { key: 'artifacts', label: 'Artifacts', icon: Package, description: 'Hujjatlar, kod, rasmlar va fayllar' },
  { key: 'connectors', label: 'Connectors', icon: PlugZap, description: 'Google, GitHub, Notion va Alsamos' },
  { key: 'skills', label: 'Plugins / Skills', icon: Wrench, description: 'AI imkoniyatlarini kengaytiruvchi skilllar' },
];

export function AIWorkspaceSections() {
  return <div className="space-y-1.5" aria-label="AI Workspace bo'limlari">
    {sections.map(({ key, label, icon: Icon, description }) => <WorkspaceSection key={key} workspaceKey={key} icon={<Icon className="h-4 w-4" />} label={label} description={description} />)}
  </div>;
}

function WorkspaceSection({ workspaceKey, icon, label, description }: { workspaceKey: WorkspaceKey; icon: React.ReactNode; label: string; description: string }) {
  const storageKey = `alsamos.ai.section.${workspaceKey}`;
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(storageKey);
    return saved === null ? true : saved === '1';
  });
  const toggle = () => setOpen((value) => { localStorage.setItem(storageKey, value ? '0' : '1'); return !value; });
  const openWorkspace = () => window.dispatchEvent(new CustomEvent('alsamos:open-ai-workspace', { detail: { section: workspaceKey } }));
  return <div className="rounded-xl border border-border/40 bg-background/40 overflow-hidden">
    <div className="flex items-center gap-2 px-2.5 py-2">
      <button type="button" onClick={toggle} className="flex min-w-0 flex-1 items-center gap-2 text-left" aria-expanded={open}>
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <span className="min-w-0"><span className="block truncate text-xs font-semibold">{label}</span><span className="block truncate text-[10px] text-muted-foreground">{description}</span></span>
      </button>
      <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={openWorkspace} aria-label={`${label}ni ochish`}><ArrowUpRight className="h-3.5 w-3.5" /></Button>
    </div>
    {open && <button type="button" onClick={openWorkspace} className="mx-2.5 mb-2 flex w-[calc(100%-1.25rem)] items-center justify-between rounded-lg bg-muted/40 px-2.5 py-2 text-left hover:bg-muted/70"><span className="text-[10px] text-muted-foreground">{label} workspace'ini boshqarish</span><ArrowUpRight className="h-3 w-3 text-muted-foreground" /></button>}
  </div>;
}
