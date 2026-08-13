import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Brain, Menu, Plus, Sparkles, Paperclip, ArrowUp, Square, PanelRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import type { AIConversationMessage } from '@/lib/aiConversationController';
import { useAIConversationController } from '@/lib/aiConversationController';
import { extractArtifacts } from '@/lib/aiArtifacts';
import { SLASH_COMMANDS } from '@/lib/aiIntent';
import { aiMemoryRepository } from '@/lib/aiMemoryRepository';

type Attachment = { url: string; name: string; type: string };
type Workspace = 'projects' | 'artifacts' | 'connectors' | 'skills' | 'memory';
const PIN_KEY = 'alsamos.ai.pinned';
const readPins = (): Record<string, string> => { try { return JSON.parse(localStorage.getItem(PIN_KEY) || '{}'); } catch { return {}; } };
const toController = (items: AIMessage[]): AIConversationMessage[] => items.map((m) => ({ id: m.id, role: m.role, content: m.content, status: m.error ? 'error' : 'completed' }));
const toDomain = (items: AIConversationMessage[]): AIMessage[] => items.map((m) => ({ id: m.id, role: m.role, content: m.content, error: m.status === 'error', timestamp: new Date() }));
const cleanTitle = (value: string) => value.replace(/\s+/g, ' ').trim().slice(0, 120).replace(/[.!?]+$/, '') || 'Yangi suhbat';

export default function AIPageLongTerm() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const { state, send, stop, clear, hydrate } = useAIConversationController();
  const { uploadFile, uploading, getFileType } = useFileUpload();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactId, setArtifactId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [slashOpen, setSlashOpen] = useState(false);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSaved = useRef('');

  useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  const titleFor = useCallback((items: AIMessage[]) => {
    const first = items.find((m) => m.role === 'user');
    return first ? cleanTitle(first.content) : 'Yangi suhbat';
  }, []);

  useEffect(() => {
    if (!user) { setHistoryLoading(false); return; }
    let alive = true;
    void (async () => {
      setHistoryLoading(true);
      const { data, error } = await supabase.from('ai_conversations').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (!alive) return;
      if (error) toast.error('AI suhbatlar tarixini yuklab bo‘lmadi');
      const pins = readPins();
      setConversations((data ?? []).map((row: any) => {
        const messages = Array.isArray(row.messages) ? row.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [];
        return { id: row.id, title: cleanTitle(row.title || titleFor(messages)), messages, updatedAt: new Date(row.updated_at), pinned: Boolean(pins[row.id]) };
      }));
      setHistoryLoading(false);
    })();
    return () => { alive = false; };
  }, [user, titleFor]);

  useEffect(() => {
    if (!user) return;
    void supabase.from('ai_memories').select('enabled').eq('owner_id', user.id).eq('enabled', true).limit(1).then(({ data }) => setMemoryEnabled(Boolean(data?.length)));
  }, [user]);

  const persist = useCallback(async (items: AIMessage[]) => {
    if (!user || !items.length) return;
    const title = titleFor(items);
    const signature = JSON.stringify([title, ...items.map((m) => [m.id, m.role, m.content, m.error])]);
    if (signature === lastSaved.current) return;
    lastSaved.current = signature;
    if (currentId) {
      const { error } = await supabase.from('ai_conversations').update({ messages: items as any, title, project_id: selectedProjectId, updated_at: new Date().toISOString() }).eq('id', currentId).eq('user_id', user.id);
      if (error) toast.error('Suhbatni saqlab bo‘lmadi');
      setConversations((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: items, title, updatedAt: new Date() } : c));
    } else {
      const { data, error } = await supabase.from('ai_conversations').insert({ user_id: user.id, title, messages: items as any, context: 'chat', project_id: selectedProjectId }).select().single();
      if (error) { toast.error('Yangi suhbatni saqlab bo‘lmadi'); return; }
      if (data) { setCurrentId(data.id); setConversations((prev) => [{ id: data.id, title, messages: items, updatedAt: new Date(), pinned: false }, ...prev]); }
    }
  }, [currentId, selectedProjectId, titleFor, user]);

  useEffect(() => { if (state.messages.length && !state.busy) void persist(toDomain(state.messages)); }, [state.messages, state.busy, persist]);

  useEffect(() => {
    const listener = (event: Event) => {
      const section = (event as CustomEvent<{ section?: Workspace }>).detail?.section;
      if (section) setWorkspace(section);
    };
    window.addEventListener('alsamos:open-ai-workspace', listener);
    return () => window.removeEventListener('alsamos:open-ai-workspace', listener);
  }, []);

  const startNew = () => { stop(); clear(); setInput(''); setAttachments([]); setCurrentId(null); setSelectedProjectId(null); lastSaved.current = ''; setArtifactOpen(false); setArtifactId(null); if (isMobile) setSidebarOpen(false); inputRef.current?.focus(); };
  const selectConversation = (conversation: AIConversation) => { stop(); setCurrentId(conversation.id); lastSaved.current = ''; setInput(''); setAttachments([]); hydrate(toController(conversation.messages)); if (isMobile) setSidebarOpen(false); };
  const deleteConversation = async (id: string) => { const { error } = await supabase.from('ai_conversations').delete().eq('id', id).eq('user_id', user?.id ?? ''); if (error) toast.error('Suhbat o‘chirilmadi'); else { setConversations((prev) => prev.filter((c) => c.id !== id)); if (id === currentId) startNew(); } };
  const renameConversation = async (id: string, title: string) => { const next = cleanTitle(title); if (next === 'Yangi suhbat') return; const { error } = await supabase.from('ai_conversations').update({ title: next }).eq('id', id).eq('user_id', user?.id ?? ''); if (error) { toast.error('Chat nomi saqlanmadi'); return; } setConversations((prev) => prev.map((c) => c.id === id ? { ...c, title: next } : c)); };
  const togglePin = (id: string) => { const pins = readPins(); if (pins[id]) delete pins[id]; else pins[id] = '1'; localStorage.setItem(PIN_KEY, JSON.stringify(pins)); setConversations((prev) => prev.map((c) => c.id === id ? { ...c, pinned: Boolean(pins[id]) } : c)); };

  const upload = async (files: File[]) => { for (const file of files) { if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name}: 20MB dan katta`); continue; } const result = await uploadFile(file); if (result) setAttachments((prev) => [...prev, { url: result.url, name: result.name, type: getFileType(result.type) }]); } };
  const submit = async (text = input) => {
    const raw = text.trim();
    if ((!raw && !attachments.length) || state.busy) return;
    const attached = attachments.map((a, i) => ({ id: `${a.name}-${i}`, name: a.name, mimeType: a.type, url: a.url }));
    setInput(''); setSlashOpen(false); setAttachments([]);
    await send(raw, { conversationId: currentId ?? undefined, projectId: selectedProjectId ?? undefined, attachments: attached });
  };

  const domainMessages = useMemo(() => toDomain(state.messages), [state.messages]);
  const artifacts = useMemo(() => extractArtifacts(domainMessages), [domainMessages]);
  const slashMatches = useMemo(() => SLASH_COMMANDS.filter((c) => c.cmd.startsWith(input.toLowerCase())), [input]);
  const workspaceItems: Array<[Workspace, string, typeof Brain]> = [['projects', 'Projects', Brain], ['artifacts', 'Artifacts', Brain], ['connectors', 'Connectors', Brain], ['skills', 'Plugins / Skills', Brain], ['memory', 'Memory', Brain]];

  const goHome = useCallback(() => { stop(); navigate('/home'); }, [navigate, stop]);

  return <div className="relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-background md:h-[calc(100dvh-2rem)]">
    {sidebarOpen && <><div className={isMobile ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' : 'hidden'} onClick={() => setSidebarOpen(false)} /><aside className={isMobile ? 'fixed inset-y-0 left-0 z-50 w-[min(90vw,360px)] bg-background shadow-2xl' : 'relative z-20 h-full w-[300px] shrink-0 border-r border-border/50 bg-card/30'}><AISidebar conversations={conversations} loading={historyLoading} activeId={currentId} isMobile={isMobile} profile={profile} onNew={startNew} onSelect={selectConversation} onDelete={deleteConversation} onRename={renameConversation} onTogglePin={togglePin} onClose={() => setSidebarOpen(false)} /><div className="border-t border-border/50 p-2"><Button variant="ghost" className="w-full justify-start gap-2 text-xs" onClick={goHome}><ArrowLeft className="h-4 w-4" />Bosh menyu</Button><div className="mt-1 grid grid-cols-2 gap-1">{workspaceItems.map(([key, label]) => <Button key={key} variant="ghost" className="justify-start gap-2 text-[11px]" onClick={() => setWorkspace(key)}><Brain className="h-3.5 w-3.5" />{label}</Button>)}</div></div></aside></>}
    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-1.5 border-b border-border/50 bg-background/85 px-2.5 backdrop-blur-xl sm:h-16 sm:px-5"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSidebarOpen((v) => !v)} aria-label="AI menyusini ochish"><Menu className="h-5 w-5" /></Button><Button variant="ghost" size="icon" className="h-9 w-9" onClick={goHome} aria-label="Bosh menyu"><ArrowLeft className="h-5 w-5" /></Button><div className="flex min-w-0 items-center gap-2"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></div><h1 className="truncate text-sm font-semibold">Alsamos AI</h1></div><div className="ml-auto flex items-center gap-1"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={startNew} aria-label="Yangi suhbat"><Plus className="h-4 w-4" /></Button>{artifacts.length > 0 && <Button variant={artifactOpen ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setArtifactOpen((v) => !v)} aria-label="Artifact paneli"><PanelRight className="h-4 w-4" /></Button>}</div></header>
      <div className="flex min-h-0 flex-1">
        <ScrollArea className="min-w-0 flex-1"><div className="mx-auto w-full max-w-4xl px-4 pb-44 pt-6 sm:px-6 sm:pt-10">
          {domainMessages.length === 0 ? <div className="flex min-h-[calc(100dvh-17rem)] flex-col items-center justify-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"><Sparkles className="h-8 w-8" /></div><h2 className="text-2xl font-semibold sm:text-3xl">{profile?.display_name ? `Salom, ${profile.display_name}` : 'Salom'}</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Savol bering, rasm yarating, kod yozing yoki hujjat tayyorlang. Barcha so‘rovlar yagona chat orqali ishlaydi.</p><div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">{[['Bozordan tavsiya','Bozordan eng yaxshi takliflarni topishga yordam ber'],['Marshrut rejalash','Toshkentda bir kunlik sayohat marshrutini rejalashtir'],['Kod yozish','React komponent yaratishda yordam ber'],['Hisobot tayyorlash','Kichik biznes uchun oylik hisobot shabloni tayyorlab ber']].map(([label,prompt]) => <button key={label} onClick={() => void submit(prompt)} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm hover:bg-muted/50"><span>{label}</span><span className="mt-1 block text-xs text-muted-foreground">{prompt}</span></button>)}</div></div> : <div>{domainMessages.map((message, index) => <AIMessageBubble key={message.id} message={message} isStreaming={state.busy && index === domainMessages.length - 1} />)}{state.busy && state.messages.at(-1)?.content === '' && <div className="ml-11 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" />Alsamos AI ishlamoqda...</div>}{state.error && <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive">{state.error}</div>}</div>}
        </div></ScrollArea>
        {artifactOpen && artifacts.length > 0 && <AIArtifactPanel artifacts={artifacts} activeId={artifactId} onSelect={setArtifactId} onClose={() => setArtifactOpen(false)} isMobile={isMobile} />}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3 sm:px-6 sm:pb-5"><div className="pointer-events-auto w-full max-w-4xl rounded-2xl border border-border/60 bg-background/95 p-2 shadow-xl backdrop-blur-xl"><div className="mb-1 flex flex-wrap gap-1.5">{attachments.map((a, i) => <span key={`${a.name}-${i}`} className="inline-flex max-w-full items-center gap-1 rounded-lg bg-muted px-2 py-1 text-[10px]"><span className="max-w-[180px] truncate">{a.name}</span><button onClick={() => setAttachments((items) => items.filter((_, index) => index !== i))}>×</button></span>)}</div><div className="flex items-end gap-2"><input id="ai-attachment-input" type="file" multiple className="hidden" onChange={(e) => { if (e.target.files) void upload(Array.from(e.target.files)); e.currentTarget.value = ''; }} /><Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" disabled={uploading} onClick={() => document.getElementById('ai-attachment-input')?.click()} aria-label="Fayl biriktirish"><Paperclip className="h-5 w-5" /></Button><div className="relative min-w-0 flex-1"><Textarea ref={inputRef} value={input} onChange={(e) => { setInput(e.target.value); setSlashOpen(e.target.value.startsWith('/')); }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void submit(); } }} placeholder="Savol bering, rasm yarating yoki kod yozing..." className="min-h-10 max-h-40 resize-none border-0 bg-transparent px-1 py-2 text-sm shadow-none focus-visible:ring-0" />{slashOpen && slashMatches.length > 0 && <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-border bg-popover p-1 shadow-xl">{slashMatches.slice(0, 6).map((command) => <button key={command.cmd} className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-muted" onClick={() => { setInput(`${command.cmd} `); setSlashOpen(false); inputRef.current?.focus(); }}><span className="font-medium">{command.cmd}</span><span className="ml-2 text-muted-foreground">{command.label}</span></button>)}</div>}</div><Button size="icon" className="h-9 w-9 shrink-0 rounded-xl" disabled={state.busy ? false : (!input.trim() && !attachments.length)} onClick={() => state.busy ? stop() : void submit()} aria-label={state.busy ? 'To‘xtatish' : 'Yuborish'}>{state.busy ? <Square className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}</Button></div><div className="mt-1 flex items-center justify-between px-1 text-[9px] text-muted-foreground"><span>{memoryEnabled ? 'Memory yoqilgan' : 'Memory hozircha bo‘sh'}</span><span>Enter — yuborish · Shift+Enter — yangi qator</span></div></div></div>
    </main>
    {workspace && <AIWorkspaceDialog open section={workspace} onClose={() => setWorkspace(null)} />}
  </div>;
}
