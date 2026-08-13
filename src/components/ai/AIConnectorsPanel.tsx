import { CalendarDays, Check, Github, Globe2, HardDrive, Mail, PlugZap, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { aiWorkspaceRepository } from '@/lib/aiWorkspaceRepository';
import type { AIConnector } from '@/lib/aiWorkspaceArchitecture';

type Definition = { kind: AIConnector['kind']; name: string; description: string; icon: typeof Github };
const definitions: Definition[] = [
  { kind: 'google-drive', name: 'Google Drive', description: 'Fayllarni AI bilan ishlatish', icon: HardDrive },
  { kind: 'gmail', name: 'Gmail', description: 'Email xabarlarini izlash va tahlil qilish', icon: Mail },
  { kind: 'calendar', name: 'Google Calendar', description: 'Tadbirlarni rejalashtirish', icon: CalendarDays },
  { kind: 'github', name: 'GitHub', description: 'Repository, issue va pull requestlar', icon: Github },
  { kind: 'notion', name: 'Notion', description: 'Knowledge bazasi va sahifalar', icon: Globe2 },
  { kind: 'bozor', name: 'Alsamos Bozor', description: 'Bozor ma’lumotlarini AI kontekstiga ulash', icon: PlugZap },
  { kind: 'tolov', name: 'Alsamos To‘lov', description: 'To‘lov moduliga AI orqali kirish', icon: PlugZap },
  { kind: 'xarita', name: 'Alsamos Xarita', description: 'Marshrut va joylashuv konteksti', icon: PlugZap },
];

export function AIConnectorsPanel() {
  const [connected, setConnected] = useState<AIConnector[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void aiWorkspaceRepository.listConnectors().then(setConnected).catch((e) => setError(e instanceof Error ? e.message : 'Connectorlar yuklanmadi')); }, []);
  const toggle = async (definition: Definition) => {
    const existing = connected.find((x) => x.kind === definition.kind);
    setBusy(definition.kind); setError(null);
    try {
      if (existing?.connected) { await aiWorkspaceRepository.disconnectConnector(existing.id); setConnected((items) => items.map((x) => x.id === existing.id ? { ...x, connected: false, accountLabel: undefined } : x)); }
      else { const item = await aiWorkspaceRepository.connectConnector(definition.kind, definition.name, definition.kind.startsWith('bozor') || definition.kind.startsWith('tolov') || definition.kind.startsWith('xarita') ? 'Alsamos account' : undefined); setConnected((items) => [...items.filter((x) => x.id !== item.id), item]); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Connector holati o‘zgartirilmadi'); }
    finally { setBusy(null); }
  };
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="mb-6"><h2 className="text-lg font-semibold">Connectors</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Ulanish holati Supabase'da saqlanadi. OAuth talab qiladigan tashqi servislar uchun keyingi gateway auth bosqichi kerak.</p></div>{error && <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">{error}</div>}<div className="grid gap-2 sm:grid-cols-2">{definitions.map((item) => { const Icon = item.icon; const row = connected.find((x) => x.kind === item.kind); const isConnected = Boolean(row?.connected); return <article key={item.kind} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-xs font-semibold">{item.name}</h3><p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{item.description}</p>{row?.accountLabel && <p className="mt-1 truncate text-[9px] text-primary">{row.accountLabel}</p>}</div><Button size="sm" variant={isConnected ? 'secondary' : 'outline'} className="shrink-0 text-[10px]" disabled={busy === item.kind} onClick={() => void toggle(item)}>{isConnected ? <><Check className="mr-1 h-3 w-3" />Ulangan</> : <><RefreshCw className="mr-1 h-3 w-3" />Ulash</>}</Button></article>; })}</div></section>;
}
