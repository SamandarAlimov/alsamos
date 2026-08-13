import { useEffect, useState } from 'react';
import { FolderKanban, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { aiWorkspaceRepository } from '@/lib/aiWorkspaceRepository';
import type { AIProject } from '@/lib/aiWorkspaceArchitecture';

export function AIProjectsPanel({ onSelect }: { onSelect?: (project: AIProject) => void }) {
  const [projects, setProjects] = useState<AIProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const load = async () => { setLoading(true); setError(null); try { setProjects(await aiWorkspaceRepository.listProjects()); } catch (e) { setError(e instanceof Error ? e.message : 'Loyihalarni yuklab bo‘lmadi'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const select = (project: AIProject) => { onSelect?.(project); window.dispatchEvent(new CustomEvent('alsamos:select-ai-project', { detail: { projectId: project.id, name: project.name } })); };
  const create = async () => { if (!name.trim()) return; try { const project = await aiWorkspaceRepository.createProject({ name, instructions }); setProjects((p) => [project, ...p]); setName(''); setInstructions(''); setCreating(false); select(project); } catch (e) { setError(e instanceof Error ? e.message : 'Loyiha yaratilmadi'); } };
  const remove = async (id: string) => { try { await aiWorkspaceRepository.deleteProject(id); setProjects((p) => p.filter((x) => x.id !== id)); } catch (e) { setError(e instanceof Error ? e.message : 'Loyiha o‘chirilmadi'); } };
  return <div className="p-4 space-y-4"><div className="flex items-center justify-between"><div><h2 className="text-base font-semibold">Projects</h2><p className="text-xs text-muted-foreground">Suhbatlar va custom instructions'ni bir joyda saqlang.</p></div><Button size="sm" onClick={() => setCreating(true)} className="gap-1.5"><Plus className="h-3.5 w-3.5" />New Project</Button></div>{error && <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">{error}</div>}{creating && <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" /><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Custom instructions (optional)" /><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setCreating(false)}><X className="h-3.5 w-3.5 mr-1" />Cancel</Button><Button size="sm" onClick={() => void create()}><Check className="h-3.5 w-3.5 mr-1" />Create</Button></div></div>}{loading ? <div className="text-xs text-muted-foreground py-8 text-center">Loading projects...</div> : projects.length === 0 ? <div className="rounded-xl border border-dashed border-border p-8 text-center"><FolderKanban className="h-8 w-8 mx-auto mb-2 text-muted-foreground" /><p className="text-sm font-medium">No projects yet</p><p className="text-xs text-muted-foreground mt-1">Create a project to organize related AI work.</p></div> : <div className="grid gap-2 sm:grid-cols-2">{projects.map((project) => <div key={project.id} className="group rounded-xl border border-border/50 p-3 hover:bg-muted/30 cursor-pointer" onClick={() => select(project)}><div className="flex items-start gap-3"><div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><FolderKanban className="h-4 w-4 text-primary" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{project.name}</p><p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{project.instructions || 'Custom instructions yo‘q'}</p></div><Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); void remove(project.id); }} aria-label="Delete project"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div></div>)}</div>}</div>;
}
