import { ChevronRight, FolderKanban, Package, PlugZap, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type WorkspaceKey = 'projects' | 'artifacts' | 'connectors' | 'skills';

export function AIWorkspaceSections() {
  const sections: Array<{ key: WorkspaceKey; label: string; icon: typeof FolderKanban; empty: string }> = [
    { key: 'projects', label: 'Projects', icon: FolderKanban, empty: 'Loyihalar va project instructions' },
    { key: 'artifacts', label: 'Artifacts', icon: Package, empty: 'Yaratilgan hujjat, kod, rasm va fayllar' },
    { key: 'connectors', label: 'Connectors', icon: PlugZap, empty: 'Google, GitHub, Notion va Alsamos modullari' },
    { key: 'skills', label: 'Plugins / Skills', icon: Wrench, empty: 'AI imkoniyatlarini kengaytiruvchi skilllar' },
  ];
  return <div className="space-y-0.5">{sections.map(({ key, label, icon: Icon, empty }) => <WorkspaceSection key={key} workspaceKey={key} storageKey={`alsamos.ai.section.${key}`} icon={<Icon className="h-3.5 w-3.5 text-muted-foreground" />} label={label} empty={empty} />)}</div>;
}

function WorkspaceSection({ workspaceKey, storageKey, icon, label, empty }: { workspaceKey: WorkspaceKey; storageKey: string; icon: React.ReactNode; label: string; empty: string }) {
  const [open, setOpen] = useState(() => localStorage.getItem(storageKey) === '1');
  const toggle = () => setOpen((value) => { localStorage.setItem(storageKey, value ? '0' : '1'); return !value; });
  const openWorkspace = () => window.dispatchEvent(new CustomEvent('alsamos:open-ai-workspace', { detail: { section: workspaceKey } }));
  return <div className="rounded-xl"><button onClick={toggle} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold hover:bg-muted/50"><ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />{icon}<span>{label}</span></button>{open && <div className="mx-2 mb-1 rounded-lg border border-border/40 bg-muted/20 px-2.5 py-2"><p className="text-[10px] text-muted-foreground">{empty}</p><Button variant="ghost" size="sm" className="mt-1 h-7 px-2 text-[10px]" onClick={openWorkspace}>Ochish</Button></div>}</div>;
}
