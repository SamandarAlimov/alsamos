import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Plus, Sparkles, PanelRight, Square, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';
import { AISidebar } from '@/components/ai/AISidebar';
import { AIComposer, type ComposerAttachment } from '@/components/ai/AIComposer';
import { AIMessageBubble } from '@/components/ai/AIMessageBubble';
import { AIArtifactPanel } from '@/components/ai/AIArtifactPanel';
import { AIWorkspaceDialog } from '@/components/ai/AIWorkspaceDialog';
import type { AIConversation, AIMessage } from '@/components/ai/types';
import { useAIConversationController, type AIConversationMessage } from '@/lib/aiConversationController';
import { extractArtifacts } from '@/lib/aiArtifacts';

const PIN_KEY = 'alsamos.ai.pinned';
const TITLE_KEY = 'alsamos.ai.titles';
const readMap = (key: string): Record<string, string> => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } };
const writeMap = (key: string, value: Record<string, string>) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

function toControllerMessages(messages: AIMessage[]): AIConversationMessage[] {
  return messages.map((m) => ({ id: m.id, role: m.role, content: m.content, status: m.error ? 'error' : 'completed' }));
}
function toDomainMessages(messages: AIConversationMessage[]): AIMessage[] {
  return messages.map((m) => ({ id: m.id, role: m.role, content: m.content, error: m.status === 'error', timestamp: new Date() }));
}

export default function AIPageV2() {
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const { state, send, stop, clear, hydrate } = useAIConversationController();
  const { uploadFile, uploading, getFileType } = useFileUpload();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const [workspace, setWorkspace] = useState<'projects' | 'artifacts' | 'connectors' | 'skills' | null>(null);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactId, setArtifactId] = useState<string | null>(null);
  const lastSaved = useRef('');

  useEffect(() => setSidebarOpen(!isMobile), [isMobile]);

  const titleFor = useCallback((messages: AIMessage[], id?: string) => {
    const overrides = readMap(TITLE_KEY);
    if (id && overrides[id]) return overrides[id];
    const first = messages.find((m) => m.role === 'user');
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
        const messages: AIMessage[] = (row.messages || []).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        return { id: row.id, title: titleFor(messages, row.id), messages, updatedAt: new Date(row.updated_at), pinned: Boolean(pins[row.id]) };
      }));
      setHistoryLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, titleFor]);

  const persist = useCallback(async (messages: AIMessage[]) => {
    if (!user || messages.length === 0) return;
    const signature = JSON.stringify(messages.map((m) => [m.id, m.role, m.content, m.error]));
    if (signature === lastSaved.current) return;
    lastSaved.current = signature;
    if (currentId) {
      await supabase.from('ai_conversations').update({ messages: messages as any, updated_at: new Date().toISOString() }).eq('id', currentId);
      setConversations((items) => items.map((c) => c.id === currentId ? { ...c, messages, title: titleFor(messages, c.id), updatedAt: new Date() } : c));
    } else {
      const { data } = await supabase.from('ai_conversations').insert({ user_id: user.id, messages: messages as any, context: 'chat' }).select().single();
      if (data) {
        setCurrentId(data.id);
        setConversations((items) => [{ id: data.id, title: titleFor(messages, data.id), messages, updatedAt: new Date() }, ...items]);
      }
    }
  }, [currentId, titleFor, user]);

  useEffect(() => {
    if (state.messages.length === 0 || state.busy) return;
    const domain = toDomainMessages(state.messages);
    void persist(domain);
  }, [state.messages, state.busy, persist]);

  useEffect(() => {
    const onWorkspace = (event: Event) => {
      const detail = (event as CustomEvent<{ section?: 'projects' | 'artifacts' | 'connectors' | 'skills' }>).detail;
      if (detail?.section) setWorkspace(detail.section);
    };
    window.addEventListener('alsamos:open-ai-workspace', onWorkspace);
    return () => window.removeEventListener('alsamos:open-ai-workspace', onWorkspace);
  }, []);

  const startNew = () => { stop(); clear(); lastSaved.current = ''; setCurrentId(null); setAttachments([]); setArtifactOpen(false); if (isMobile) setSidebarOpen(false); };
  const selectConversation = (conversation: AIConversation) => { stop(); setCurrentId(conversation.id); lastSaved.current = ''; hydrate(toControllerMessages(conversation.messages)); if (isMobile) setSidebarOpen(false); };
  const deleteConversation = async (id: string) => { await supabase.from('ai_conversations').delete().eq('id', id); setConversations((items) => items.filter((c) => c.id !== id)); if (id === currentId) startNew(); };
  const renameConversation = (id: string, title: string) => { const map = readMap(TITLE_KEY); map[id] = title; writeMap(TITLE_KEY, map); setConversations((items) => items.map((c) => c.id === id ? { ...c, title } : c)); };
  const togglePin = (id: string) => { const pins = readMap(PIN_KEY); pins[id] ? delete pins[id] : pins[id] = '1'; writeMap(PIN_KEY, pins); setConversations((items) => items.map((c) => c.id === id ? { ...c, pinned: Boolean(pins[id]) } : c)); };

  const upload = async (files: File[]) => { for (const file of files) { if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name}: 20MB dan katta`); continue; } const result = await uploadFile(file); if (result) setAttachments((items) => [...items, { url: result.url, name: result.name, type: getFileType(result.type) }]); else toast.error(`${file.name} yuklanmadi`); } };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if ((!trimmed && !attachments.length) || state.busy) return;
    const attached = attachments.map((a, index) => ({ id: `${a.name}-${index}`, name: a.name, mimeType: a.type, url: a.url }));
    setAttachments([]);
    await send(trimmed, { conversationId: currentId ?? undefined, attachments: attached });
  };

  const domainMessages = useMemo(() => toDomainMessages(state.messages), [state.messages]);
  const artifacts = useMemo(() => extractArtifacts(domainMessages), [domainMessages]);
  const showHome = state.messages.length === 0;
  const pinned = conversations.filter((c) => c.pinned);
  const artifactCount = artifacts.length;

  return <div className="relative flex h-[calc(100dvh-4rem)] min-h-0 overflow-hidden bg-background md:h-[calc(100dvh-2rem)]">
    {sidebarOpen && <><div className={isMobile ? 'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm' : 'hidden'} onClick={() => setSidebarOpen(false)} /><aside className={isMobile ? 'fixed inset-y-0 left-0 z-50 w-[min(88vw,340px)] bg-background shadow-2xl' : 'relative z-20 h-full w-[280px] shrink-0 border-r border-border/50 bg-card/30'}><AISidebar conversations={conversations} loading={historyLoading} activeId={currentId} isMobile={isMobile} profile={profile} onNew={startNew} onSelect={selectConversation} onDelete={deleteConversation} onRename={renameConversation} onTogglePin={togglePin} onClose={() => setSidebarOpen(false)} /></aside></>}

    <main className="flex min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/80 px-3 backdrop-blur-xl sm:h-16 sm:px-5"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setSidebarOpen((v) => !v)} aria-label="AI sidebar"><Menu className="h-5 w-5" /></Button><div className="flex min-w-0 items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-4 w-4" /></div><div className="min-w-0"><h1 className="truncate text-sm font-semibold">Alsamos AI</h1><p className="hidden text-[10px] text-muted-foreground sm:block">Unified intelligent workspace</p></div></div><div className="ml-auto flex items-center gap-1"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={startNew} aria-label="New chat"><Plus className="h-4 w-4" /></Button>{artifactCount > 0 && <Button variant={artifactOpen ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9" onClick={() => setArtifactOpen((v) => !v)} aria-label="Artifacts"><PanelRight className="h-4 w-4" /></Button>}</div></header>

      <div className="flex min-h-0 flex-1">
        <ScrollArea className="min-w-0 flex-1"><div className="mx-auto w-full max-w-4xl px-4 pb-40 pt-6 sm:px-6 sm:pt-10">
          {showHome ? <div className="flex min-h-[calc(100dvh-16rem)] flex-col items-center justify-center text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary"><Sparkles className="h-8 w-8" /></div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{profile?.display_name ? `Salom, ${profile.display_name}` : 'Salom'}</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground">Savol bering, rasm yarating, kod yozing yoki hujjat tayyorlang. So‘rov turi avtomatik aniqlanadi.</p><div className="mt-7 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2"><button onClick={() => void handleSend('Bozordan eng yaxshi takliflarni topishga yordam ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm transition hover:bg-muted/50">Bozordan tavsiya<span className="mt-1 block text-xs text-muted-foreground">Eng yaxshi takliflarni toping</span></button><button onClick={() => void handleSend('Toshkentda bir kunlik sayohat marshrutini rejalashtir')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm transition hover:bg-muted/50">Marshrut rejalash<span className="mt-1 block text-xs text-muted-foreground">Xarita bo‘yicha yordam</span></button><button onClick={() => void handleSend('React komponent yaratishda yordam ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm transition hover:bg-muted/50">Kod yozish<span className="mt-1 block text-xs text-muted-foreground">Dasturlashda yordam</span></button><button onClick={() => void handleSend('Kichik biznes uchun oylik hisobot shabloni tayyorlab ber')} className="rounded-2xl border border-border/60 bg-card p-4 text-left text-sm transition hover:bg-muted/50">Hisobot tayyorlash<span className="mt-1 block text-xs text-muted-foreground">Biznes hujjatlari</span></button></div></div> : <div>{domainMessages.map((message, index) => <AIMessageBubble key={message.id} message={message} isStreaming={state.busy && index === domainMessages.length - 1} />)}{state.busy && state.messages.at(-1)?.content === '' && <div className="ml-11 flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /> Alsamos AI ishlamoqda...</div>}{state.error && <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-destructive"><AlertCircle className="h-4 w-4" />{state.error}</div>}</div>}
        </div></ScrollArea>
        {artifactOpen && artifactCount > 0 && <div className="fixed inset-0 z-40 bg-background sm:static sm:z-auto sm:flex"><AIArtifactPanel artifacts={artifacts} activeId={artifactId} onSelect={setArtifactId} onClose={() => setArtifactOpen(false)} isMobile={isMobile} /></div>}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pb-3 pt-12 sm:px-6 sm:pb-5"><div className="pointer-events-auto mx-auto max-w-4xl"><AIComposer value="" onChange={() => {}} onSend={handleSend} onStop={stop} busy={state.busy} uploading={uploading} attachments={attachments} onPickFiles={(e) => { void upload(Array.from(e.target.files || [])); e.target.value = ''; }} onDropFiles={(files) => void upload(files)} onRemoveAttachment={(index) => setAttachments((items) => items.filter((_, i) => i !== index))} /><div className="mt-1 flex items-center justify-center gap-2 text-[9px] text-muted-foreground"><span>AI javoblari xato bo‘lishi mumkin.</span>{state.busy && <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px]" onClick={stop}><Square className="mr-1 h-2.5 w-2.5 fill-current" />To‘xtatish</Button>}</div></div></div>
    </main>

    {workspace && <AIWorkspaceDialog open={Boolean(workspace)} section={workspace} onClose={() => setWorkspace(null)} />}
    {sidebarOpen && isMobile && <button onClick={() => setSidebarOpen(false)} className="fixed right-3 top-3 z-[60] flex h-8 w-8 items-center justify-center rounded-lg bg-background shadow" aria-label="Close sidebar"><X className="h-4 w-4" /></button>}
  </div>;
}
