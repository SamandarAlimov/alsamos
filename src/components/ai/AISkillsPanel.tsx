import { useEffect, useMemo, useState } from 'react';
import { Check, Code2, FileSpreadsheet, Gavel, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { aiWorkspaceRepository } from '@/lib/aiWorkspaceRepository';
import type { AISkill } from '@/lib/aiWorkspaceArchitecture';

const fallbackSkills: AISkill[] = [
  { id: 'code-reviewer', name: 'Code Reviewer', description: 'Kod sifati, security va maintainability tahlili.', enabled: false, scope: 'global' },
  { id: 'excel-expert', name: 'Excel Expert', description: 'Formulalar, pivotlar, jadval tahlili va chartlar.', enabled: false, scope: 'global' },
  { id: 'legal-reviewer', name: 'Legal Reviewer', description: 'Shartnoma va huquqiy matnlarni strukturaviy ko‘rib chiqish.', enabled: false, scope: 'global' },
  { id: 'researcher', name: 'Researcher', description: 'Manbalarni topish, solishtirish va research tasklarini rejalash.', enabled: false, scope: 'global' },
];
const icons = [Code2, FileSpreadsheet, Gavel, Search];

export function AISkillsPanel() {
  const [skills, setSkills] = useState<AISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  useEffect(() => { let alive = true; void aiWorkspaceRepository.listSkills().then((items) => { if (alive) setSkills(items.length ? items : fallbackSkills); }).catch(() => { if (alive) setSkills(fallbackSkills); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; }; }, []);
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return q ? skills.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q)) : skills; }, [skills, query]);
  const toggle = async (id: string, checked: boolean) => { const previous = skills.find((s) => s.id === id)?.enabled ?? false; setSkills((current) => current.map((s) => s.id === id ? { ...s, enabled: checked } : s)); setSavingId(id); try { await aiWorkspaceRepository.setSkillEnabled(id, checked, 'global'); } catch { setSkills((current) => current.map((s) => s.id === id ? { ...s, enabled: previous } : s)); } finally { setSavingId(null); } };
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h2 className="text-lg font-semibold">Plugins / Skills</h2></div><p className="mt-1 text-xs leading-5 text-muted-foreground">AI'ning maxsus vazifalar uchun qobiliyatlarini boshqaring.</p></div><div className="relative w-full sm:w-56"><Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Skill qidirish..." className="h-8 pl-8 text-xs" /></div></div>{loading ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div> : <div className="space-y-2">{filtered.map((skill, index) => { const Icon = icons[index % icons.length]; return <article key={skill.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="truncate text-xs font-semibold">{skill.name}</h3><Badge variant="outline" className="hidden shrink-0 px-1.5 py-0 text-[9px] sm:inline-flex">{skill.scope}</Badge></div><p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{skill.description}</p></div><Switch disabled={savingId === skill.id} checked={skill.enabled} onCheckedChange={(checked) => void toggle(skill.id, checked)} aria-label={`${skill.name} ni ${skill.enabled ? 'o‘chirish' : 'yoqish'}`} /></article>; })}</div>}{!loading && filtered.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">Skill topilmadi.</div>}<div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-border p-4"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-xs font-medium">Persistent skill state</p><p className="mt-1 text-[10px] leading-4 text-muted-foreground">Global skill tanlovi endi `ai_user_skills` orqali foydalanuvchiga bog‘lanadi; saqlash xatosida UI oldingi holatiga qaytadi.</p></div></div></section>;
}
