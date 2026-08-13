import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Plus, Sparkles, PanelRight, Paperclip, ArrowUp, Square, X, AlertCircle, FolderKanban, Package, PlugZap, Wrench } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';
import { AISidebar } from '@/components/ai/AISidebar';
import { AIMessageBubble } from '@/components/ai/AIMessageBubble';
import { AIArtifactPanel } from '@/components/ai/AIArtifactPanel';
import { AIWorkspaceDialog } from '@/components/ai/AIWorkspaceDialog';
import type { AIConversation, AIMessage } from '@/components/ai/types';
import type { ComposerAttachment } from '@/components/ai/AIComposer';
import { useAIConversationController, type AIConversationMessage } from '@/lib/aiConversationController';
import { extractArtifacts } from '@/lib/aiArtifacts';
import { detectIntent, SLASH_COMMANDS } from '@/lib/aiIntent';

const PIN_KEY = 'alsamos.ai.pinned';
const TITLE_KEY = 'alsamos.ai.titles';
const readMap = (key: string): Record<string, string> => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } };
const writeMap = (key: string, value: Record<string, string>) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
const toController = (items: AIMessage[]): AIConversationMessage[] => items.map((m) => ({ id: m.id, role: m.role, content: m.content, status: m.error ? 'error' : 'completed' }));
const toDomain = (items: AIConversationMessage[]): AIMessage[] => items.map((m) => ({ id: m.id, role: m.role, content: m.content, error: m.status === 'error', timestamp: new Date() }));

export default function AIPageV3() {
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const { state, send, stop, clear, hydrate } = useAIConversationController();
  const { uploadFile, uploading, getFileType } = useFileUpload();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [workspace, setWorkspace] = useState<'projects' | 'artifacts' | 'connectors' | 'skills' | null>(null);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactId, setArtifactId] = useState<string | null>(null);
  const [slashOpen, setSlashOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSaved = useRef('');

  useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  const titleFor = useCallback((items: AIMessage[], id?: string) => {
    const overrides = readMap(TITLE_KEY);
    if (id && overrides[id]) return overrides[id];
    const first = items.find((m) => m.role === 'user');
    return first ? first.content.slice(0, 48) + (first.content.length > 48 ? '…' : '') : 'Yangi suhbat';
  }, []);

  useEffect(() => {
    if (!user) { setHistoryLoading(false); return; }
    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      const { data, error } = await supabase.from('ai_conversations').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (cancelled) return;
      if (error) toast.error('AI suhbatlar tarixini yuklab bo‘lmadi');
      const pins = readMap(PIN_KEY);
      setConversations((data || []).map((row: any) => {
        const items: AIMessage[] = (row.messages || []).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        return { id: row.id, title: titleFor(items, row.id), messages: items, updatedAt: new Date(row.updated_at), pinned: Boolean(pins[row.id]) };
      }));
      setHistoryLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, titleFor]);

  const persist = useCallback(async (items: AIMessage[]) => {
    if (!user || !items.length) return;
    const signature = JSON.stringify(items.map((m) => [m.id, m.role, m.content, m.error]));
    if (signature === lastSaved.current) return;
    lastSaved.current = signature;
    if (currentId) {
      await supabase.from('ai_conversations').update({ messages: items as any, updated_at: new Date().toISOString() }).eq('id', currentId);
      setConversations((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: items, title: titleFor(items, c.id), updatedAt: new Date() } : c));
    } else {
      const { data } = await supabase.from('ai_conversations').insert({ user_id: user.id, messages: items as any, context: 'chat' }).select().single();
      if (data) {
        setCurrentId(data.id);
        setConversations((prev) => [{ id: data.id, title: titleFor(items, data.id), messages: items, updatedAt: new Date() }, ...prev]);
      }
    }
  }, [currentId, titleFor, user]);

  useEffect(() => { if (state.messages.length && !state.busy) void persist(toDomain(state.messages)); }, [state.messages, state.busy, persist]);

  useEffect(() => {
    const listener = (event: Event) => {
      const section = (event as CustomEvent<{ section?: 'projects' | 'artifacts' | 'connectors' | 'skills' }>).detail?.section;
      if (section) setWorkspace(section);
    };
    window.addEventListener('alsamos:open-ai-workspace', listener);
    return () => window.removeEventListener('alsamos:open-ai-workspace', listener);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const startNew = () => { stop(); clear(); setInput(''); setAttachments([]); setCurrentId(null); lastSaved.current = ''; setArtifactOpen(false); if (isMobile) setSidebarOpen(false); textareaRef.current?.focus(); };
  const selectConversation = (conversation: AIConversation) => { stop(); setCurrentId(conversation.id); lastSaved.current = ''; setInput(''); setAttachments([]); hydrate(toController(conversation.messages)); if (isMobile) setSidebarOpen(false); };
  const deleteConversation = async (id: string) => { await supabase.from('ai_conversations').delete().eq('id', id); setConversations((prev) => prev.filter((c) => c.id !== id)); if (id === currentId) startNew(); };
  const renameConversation = (id: string, title: string) => { const map = readMap(TITLE_KEY); map[id] = title; writeMap(TITLE_KEY, map); setConversations((prev) => prev.map((c) => c.id === id ? { ...c, title } : c)); };
  const togglePin = (id: string) => { const pins = readMap(PIN_KEY); pins[id] ? delete pins[id] : pins[id] = '1'; writeMap(PIN_KEY, pins); setConversations((prev) => prev.map((c) => c.id === id ? { ...c, pinned: Boolean(pins[id]) } : c)); };

  const upload = async (files: File[]) => { for (const file of files) { if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name}: 20MB dan katta`); continue; } const result = await uploadFile(file); if (result) setAttachments((prev) => [...prev, { url: result.url, name: result.name, type: getFileType(result.type) }]); else toast.error(`${file.name} yuklanmadi`); } };

  const submit = async (text = input) => {
    const raw = text.trim();
    if ((!raw && !attachments.length) || state.busy) return;
    const attached = attachments.map((a, i) => ({ id: `${a.name}-${i}`, name: a.name, mimeType: a.type, url: a.url }));
    setInput(''); setSlashOpen(false); setAttachments([]);
    await send(raw, { conversationId: currentId ?? undefined, attachments: attached });
  };

  const domainMessages = useMemo(() => toDomain(state.messages), [state.messages]);
  const artifacts = useMemo(() => extractArtifacts(domainMessages), [domainMessages]);
  const slashMatches = useMemo(() => SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase())), [input]);

  const workspaceItems = [
    ['projects', 'Projects', FolderKanban], ['artifacts', 'Artifacts', Package], ['connectors', 'Connectors', PlugZap], ['skills', 'Plugins / Skills', Wrench],
  ] as const;

  return <div className="relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-background md:h-[calc(100dvh-2rem)]">
    {sidebarOpen && <><div className={isMobile ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' : 'hidden'} onClick={() => setSidebarOpen(false)} /><aside className={isMobile ? 'fixed inset-y-0 left-0 z-50 w-[min(88vw,340px)] bg-background shadow-2xl' : 'relative z-20 h-full w-[280px] shrink-0 border-r border-border/50 bg-card/30'}><AISidebar conversations={conversations} loading={historyLoading} activeId={currentId} isMobile={isMobile} profile={profile} onNew={startNew} onSelect={selectConversation} onDelete={deleteConversation} onRename={renameConversation} onTogglePin={togglePin} onClose={() => setSidebarOpen(false)} /><div className="border-t border-border/50 p-2">{workspaceItems.map(([key, label, Icon]) => <button key={key} onClick={() => setWorkspace(key)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"><Icon className="h-4 w-4" />{label}</button>)}</div></aside></>}

    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/85 px-3 backdrop-blur-xl sm:h-16 sm:px-5"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSidebarOpen((v) => !v)}><Menu className="h-5 w-5" /></Button><div className="flex min-w-0 items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></div><div><h1 className="text-sm font-semibold">Alsamos AI</h1><p className="hidden text-[10px] text-muted-foreground sm:block">Unified intelligent workspace</p></div></div><div className="ml-auto flex items-center gap-1"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={startNew}><Plus className="h-4 w-4" /></Button>{artifacts.length > 0 && <Button variant={artifactOpen ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setArtifactOpen((v) => !v)}><PanelRight className="h-4 w-4" /></Button>}</div></header>

      <div className="flex min-h-0 flex-1">
        <ScrollArea className="min-w-0 flex-1"><div className="mx-auto w-full max-w-4xl px-4 pb-44 pt-6 sm:px-6 sm:pt-10">
          {domainMessages.length === 0 ? <div className="flex min-h-[calc(100dvh-17rem)] flex-col items-center justify-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"><Sparkles className="h-8 w-8" /></div><h2 className="text-2xl font-semibold sm:text-3xl">{profile?.display_name ? `Salom, ${profile.display_name}` : 'Salom'}</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Savol bering, rasm yarating, kod yozing yoki hujjat tayyorlang. Chat va Imagine alohida rejim emas.</p><div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2"><button onClick={() => void submit('Bozordan eng yaxshi takliflarni topishga yordam ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm hover:bg-muted/50">Bozordan tavsiya<span className="mt-1 block text-xs text-muted-foreground">Eng yaxshi takliflarni toping</span></button><button onClick={() => void submit('Toshkentda bir kunlik sayohat marshrutini rejalashtir')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm hover:bg-muted/50">Marshrut rejalash<span className="mt-1 block text-xs text-muted-foreground">Xarita bo‘yicha yordam</span></button><button onClick={() => void submit('React komponent yaratishda yordam ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm hover:bg-muted/50">Kod yozish<span className="mt-1 block text-xs text-muted-foreground">Dasturlashda yordam</span></button><button onClick={() => void submit('Kichik biznes uchun oylik hisobot shabloni tayyorlab ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm hover:bg-muted/50">Hisobot tayyorlash<span className="mt-1 block text-xs text-muted-foreground">Biznes hujjatlari</span></button></div></div> : <div>{domainMessages.map((message, index) => <AIMessageBubble key={message.id} message={message} isStreaming={state.busy && index === domainMessages.length - 1} />)}{state.busy && state.messages.at(-1)?.content === '' && <div className="ml-11 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Alsamos AI ishlamoqda...</div>}{state.error && <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"><AlertCircle className="h-4 w-4" />{state.error}</div>}</div>}
        </div></ScrollArea>
        {artifactOpen && artifacts.length > 0 && <div className="fixed inset-0 z-40 sm:static sm:flex"><AIArtifactPanel artifacts={artifacts} activeId={artifactId} onSelect={setArtifactId} onClose={() => setArtifactOpen(false)} isMobile={isMobile} /></div>}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-3 pt-12 sm:px-6 sm:pb-5"><div className="pointer-events-auto mx-auto max-w-4xl"><div className="relative rounded-2xl border border-border/70 bg-card/90 p-2 shadow-lg backdrop-blur-xl">{attachments.length > 0 && <div className="mb-2 flex max-h-20 flex-wrap gap-1.5 overflow-y-auto px-1">{attachments.map((a, i) => <div key={`${a.url}-${i}`} className="flex max-w-[240px] items-center gap-1.5 rounded-lg bg-muted px-2 py-1 text-xs"><span className="truncate">{a.name}</span><button onClick={() => setAttachments((prev) => prev.filter((_, n) => n !== i))}><X className="h-3 w-3" /></button></div>)}</div>}<div className="flex items-end gap-1.5"><input id="ai-file-input" type="file" multiple className="hidden" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.pptx,.ppt,.csv,.json,.zip,.rar,.7z" onChange={(e) => { void upload(Array.from(e.target.files || [])); e.target.value = ''; }} /><Button variant="ghost" size="icon" className="h-10 w-10 shrink-0" disabled={uploading} onClick={() => document.getElementById('ai-file-input')?.click()}><Paperclip className="h-4 w-4" /></Button><Textarea ref={textareaRef} value={input} onChange={(e) => { setInput(e.target.value); setSlashOpen(e.target.value.startsWith('/') && !e.target.value.includes(' ')); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void submit(); } if (e.key === 'Escape') setSlashOpen(false); }} placeholder="Savol bering, rasm yarating yoki kod yozing..." disabled={state.busy} rows={1} className="max-h-[200px] min-h-[40px] resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0" /><Button size="icon" className="h-10 w-10 shrink-0 rounded-xl" disabled={state.busy ? false : (!input.trim() && !attachments.length)} onClick={() => state.busy ? stop() : void submit()}>{state.busy ? <Square className="h-4 w-4 fill-current" /> : <ArrowUp className="h-4 w-4" />}</Button></div>{slashOpen && slashMatches.length > 0 && <div className="absolute bottom-full left-2 right-2 mb-2 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">{slashMatches.map((command) => <button key={command.cmd} onClick={() => { setInput(`${command.cmd} `); setSlashOpen(false); textareaRef.current?.focus(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-muted"><span className="font-mono text-primary">{command.cmd}</span><span className="text-muted-foreground">{command.description}</span></button>)}</div>}</div><div className="mt-1 text-center text-[9px] text-muted-foreground">Enter — yuborish · Shift+Enter — yangi qator</div></div></div>
    </main>
    {workspace && <AIWorkspaceDialog open section={workspace} onClose={() => setWorkspace(null)} />}
  </div>;
}
