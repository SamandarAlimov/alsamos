import { useEffect, useRef, useState } from 'react';
import { Bot, Sparkles, X, User, AlertCircle, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAI } from '@/contexts/AIContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAIConversationController } from '@/lib/aiConversationController';
import { AIComposer, type ComposerAttachment } from './AIComposer';
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/useFileUpload';
import { toast } from 'sonner';

export function AIStreamingChatDialog() {
  const { profile } = useAuth();
  const { isOpen, setIsOpen } = useAI();
  const { state, send, stop } = useAIConversationController();
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<ComposerAttachment[]>([]);
  const { uploadFile, uploading, getFileType } = useFileUpload();
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [isOpen, state.messages]);
  if (!isOpen) return null;
  const upload = async (files: File[]) => { for (const file of files) { if (file.size > 20 * 1024 * 1024) { toast.error(`${file.name}: 20MB dan katta`); continue; } const result = await uploadFile(file); if (result) setAttachments((c) => [...c, { url: result.url, name: result.name, type: getFileType(result.type) }]); else toast.error(`${file.name} yuklanmadi`); } };
  const handleSend = async () => { if ((!input.trim() && !attachments.length) || state.busy) return; const text = input; const attached = attachments.map((a, i) => ({ id: `${a.name}-${i}`, name: a.name, mimeType: a.type })); setInput(''); setAttachments([]); await send(text, { attachments: attached }); };
  return <div className="fixed inset-0 z-50 flex flex-col overflow-hidden border border-border bg-background shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(760px,calc(100dvh-3rem))] sm:w-[min(620px,calc(100vw-2rem))] sm:rounded-2xl">
    <header className="flex shrink-0 items-center gap-3 border-b border-border/60 px-4 py-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary"><Bot className="h-4 w-4 text-primary-foreground" /></div><div className="min-w-0"><h2 className="truncate text-sm font-semibold">Alsamos AI</h2><p className="text-[10px] text-muted-foreground">Unified AI workspace</p></div><div className="ml-auto flex items-center gap-1">{state.activeRoute && <span className="hidden rounded-full bg-muted px-2 py-1 text-[10px] capitalize sm:inline-flex">{state.activeRoute}</span>}<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}><X className="h-4 w-4" /></Button></div></header>
    <ScrollArea className="min-h-0 flex-1"><div className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-6">{state.messages.length === 0 ? <div className="flex min-h-[45vh] flex-col items-center justify-center text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"><Sparkles className="h-7 w-7 text-primary" /></div><h3 className="text-lg font-semibold">Alsamos AI</h3><p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">Savol bering, rasm yarating, kod yozing yoki hujjat tayyorlang. So‘rov turi avtomatik aniqlanadi.</p></div> : state.messages.map((message) => <div key={message.id} className={cn('flex gap-2.5', message.role === 'user' ? 'justify-end' : 'justify-start')}><div className={cn('max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm')}>{message.role === 'assistant' && <div className="mb-1 flex items-center gap-1 text-[9px] font-medium opacity-60"><Bot className="h-3 w-3" /> Alsamos AI</div>}<p className="whitespace-pre-wrap break-words">{message.content || (message.status === 'streaming' ? '...' : '')}</p>{message.status === 'error' && <div className="mt-2 flex items-center gap-2 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5" />{message.error?.message}</div>}{message.artifactId && <div className="mt-2 rounded-lg border border-border/50 px-2 py-1 text-[10px]">Artifact: {message.artifactId}</div>}{message.taskId && <div className="mt-2 rounded-lg border border-border/50 px-2 py-1 text-[10px]">Task: {message.taskId}</div>}</div>{message.role === 'user' && <Avatar className="h-8 w-8 shrink-0"><AvatarImage src={profile?.avatar_url || ''} /><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>}</div>)}<div ref={endRef} /></div></ScrollArea>
    {state.error && <div className="mx-3 mb-2 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive"><AlertCircle className="h-3.5 w-3.5 shrink-0" /><span className="min-w-0 flex-1 truncate">{state.error}</span></div>}
    <AIComposer value={input} onChange={setInput} onSend={handleSend} onStop={stop} busy={state.busy} uploading={uploading} attachments={attachments} onPickFiles={(e) => { void upload(Array.from(e.target.files || [])); e.target.value = ''; }} onDropFiles={(files) => void upload(files)} onRemoveAttachment={(index) => setAttachments((c) => c.filter((_, i) => i !== index))} />
    {state.busy && <div className="absolute bottom-[7.25rem] left-1/2 -translate-x-1/2"><Button size="sm" variant="secondary" className="h-7 gap-1.5 rounded-full text-[10px] shadow-lg" onClick={stop}><Square className="h-2.5 w-2.5 fill-current" /> To‘xtatish</Button></div>}
  </div>;
}
