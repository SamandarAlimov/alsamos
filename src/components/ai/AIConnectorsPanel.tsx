import { CalendarDays, Check, ExternalLink, Github, Globe2, HardDrive, Mail, PlugZap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Connector = { id: string; name: string; description: string; icon: typeof Github; status: 'available' | 'connected' };
const connectors: Connector[] = [
  { id: 'google-drive', name: 'Google Drive', description: 'Fayllarni qidirish va AI bilan ishlatish', icon: HardDrive, status: 'available' },
  { id: 'gmail', name: 'Gmail', description: 'Email xabarlarini izlash va tahlil qilish', icon: Mail, status: 'available' },
  { id: 'calendar', name: 'Google Calendar', description: 'Tadbirlarni ko‘rish va rejalashtirish', icon: CalendarDays, status: 'available' },
  { id: 'github', name: 'GitHub', description: 'Repository, issue va pull requestlar bilan ishlash', icon: Github, status: 'available' },
  { id: 'notion', name: 'Notion', description: 'Workspace sahifalari va knowledge bazasi', icon: Globe2, status: 'available' },
  { id: 'alsamos', name: 'Alsamos Modules', description: 'Bozor, To‘lov, Xarita va boshqa Alsamos servislar', icon: PlugZap, status: 'available' },
];

export function AIConnectorsPanel() {
  return <section className="mx-auto w-full max-w-3xl p-4 sm:p-6 lg:p-8"><div className="mb-6"><h2 className="text-lg font-semibold">Connectors</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">AI'ga tashqi servislar va Alsamos modullaridan kontekst olish imkonini beruvchi integratsiyalar.</p></div><div className="grid gap-2 sm:grid-cols-2">{connectors.map(({ id, name, description, icon: Icon, status }) => <article key={id} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background p-3.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted"><Icon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-xs font-semibold">{name}</h3><p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">{description}</p></div><Button size="sm" variant={status === 'connected' ? 'secondary' : 'outline'} className="shrink-0 text-[10px]" disabled>{status === 'connected' ? <><Check className="mr-1 h-3 w-3" />Ulangan</> : <><RefreshCw className="mr-1 h-3 w-3" />Ulash</>}</Button></article>)}</div><div className="mt-6 rounded-xl border border-dashed border-border p-4 text-center"><p className="text-xs font-medium">OAuth gateway kerak</p><p className="mt-1 text-[10px] text-muted-foreground">Real ulash/revoke uchun backend OAuth contract va provider credentials sozlanishi kerak.</p><Button variant="ghost" size="sm" className="mt-2 text-xs" asChild><a href="/settings/integrations">Integratsiyalar sozlamalari <ExternalLink className="ml-1.5 h-3 w-3" /></a></Button></div></section>;
}
