import { useEffect, useState } from 'react';
import { Brain, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { aiMemoryRepository, type AIMemory } from '@/lib/aiMemoryRepository';

export function AIPersonalMemoryPanel() {
  const [items, setItems] = useState<AIMemory[]>([]);
  const [editing, setEditing] = useState<AIMemory | null>(null);
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => { setLoading(true); try { setItems(await aiMemoryRepository.list()); } catch (e) { setError(e instanceof Error ? e.message : 'Memory yuklanmadi'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  const reset = () => { setOpen(false); setEditing(null); setKey(''); setValue(''); };
  const save = async () => { if (!key.trim() || !value.trim()) return; try { const item = editing ? await aiMemoryRepository.update(editing.id, { key, value }) : await aiMemoryRepository.create({ key, value }); setItems((current) => editing ? current.map((x) => x.id === item.id ? item : x) : [item, ...current.filter((x) => x.id !== item.id)]); reset(); } catch (e) { setError(e instanceof Error ? e.message : 'Memory saqlanmadi'); } };
  const remove = async (id: string) => { try { await aiMemoryRepository.remove(id); setItems((current) => current.filter((x) => x.id !== id)); } catch (e) { setError(e instanceof Error ? e.message : 'Memory o‘chirilmadi'); } };
  const toggle = async (item: AIMemory, enabled: boolean) => { try { const next = await aiMemoryRepository.update(item.id, { enabled }); setItems((current) => current.map((x) => x.id === next.id ? next : x)); } catch (e) { setError(e instanceof Error ? e.message : 'Memory holati o‘zgarmadi'); } };
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="mb-6 flex items-center justify-between gap-3"><div><div className="flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /><h2 className="text-lg font-semibold">Memory</h2></div><p className="mt-1 text-xs text-muted-foreground">Siz ruxsat bergan doimiy ma’lumotlarni boshqaring.</p></div><Button size="sm" onClick={() => { setEditing(null); setKey(''); setValue(''); setOpen(true); }}><Plus className="mr-1.5 h-3.5 w-3.5" />Qo‘shish</Button></div>{error && <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</div>}{open && <div className="mb-4 space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3"><div className="flex justify-between"><p className="text-xs font-semibold">{editing ? 'Memoryni tahrirlash' : 'Yangi memory'}</p><Button variant="ghost" size="icon" className="h-7 w-7" onClick={reset}><X className="h-3.5 w-3.5" /></Button></div><Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Masalan: preferred_language" /><Textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="AI eslab qolishi kerak bo‘lgan ma’lumot" /><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={reset}>Bekor qilish</Button><Button size="sm" onClick={() => void save()} disabled={!key.trim() || !value.trim()}>Saqlash</Button></div></div>}{loading ? <div className="space-y-2">{[1,2,3].map((n) => <div key={n} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div> : items.length === 0 ? <div className="rounded-xl border border-dashed border-border p-10 text-center"><Brain className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /><p className="text-sm font-medium">Memory yo‘q</p><p className="mt-1 text-xs text-muted-foreground">Doimiy ma’lumot qo‘shsangiz shu yerda saqlanadi.</p></div> : <div className="space-y-2">{items.map((item) => <article key={item.id} className="flex min-w-0 items-start gap-3 rounded-xl border border-border/60 p-3"><Brain className="mt-1 h-4 w-4 shrink-0 text-primary" /><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{item.key}</p><p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">{item.value}</p></div><Switch checked={item.enabled} onCheckedChange={(checked) => void toggle(item, checked)} /><Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditing(item); setKey(item.key); setValue(item.value); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button><Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => void remove(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button></article>)}</div>}</section>;
}
