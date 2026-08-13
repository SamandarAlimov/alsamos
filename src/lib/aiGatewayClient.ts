import { AI_WORKSPACE_API, type AIModelMode } from './aiWorkspaceArchitecture';
import { detectIntent } from './aiIntent';
import { supabase } from '@/integrations/supabase/client';

export type AIRoute = 'chat' | 'image' | 'video' | 'document' | 'code' | 'spreadsheet' | 'slides' | 'diagram';
export interface AIIntentRequest { message: string; userId?: string; conversationId?: string; projectId?: string; projectInstructions?: string; memoryContext?: string[]; modelMode?: AIModelMode; hintedRoute?: AIRoute; attachments?: Array<{ id: string; name: string; mimeType: string; url?: string }>; history?: Array<{ role: 'user' | 'assistant'; content: string }>; }
export interface AIIntentResponse { route: AIRoute; confidence: number; requiresClarification: boolean; clarification?: string }
export interface AIGenerateRequest extends AIIntentRequest { route: AIRoute; skillIds?: string[] }
export interface AIStreamEvent { type: 'message.delta' | 'message.completed' | 'artifact.created' | 'task.updated' | 'error'; delta?: string; messageId?: string; artifactId?: string; taskId?: string; error?: { code: string; message: string; retryable: boolean } }

const REQUEST_TIMEOUT_MS = 30_000;
const STREAM_IDLE_TIMEOUT_MS = 90_000;
const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '');
const LEGACY_AI_ASSISTANT = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/ai-assistant` : '';

export class AIGatewayTimeoutError extends Error { constructor(message: string) { super(message); this.name = 'AIGatewayTimeoutError'; } }

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(SUPABASE_KEY ? { apikey: SUPABASE_KEY } : {}) };
}

function withTimeout(signal: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  const abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
  return { controller, timedOut: () => timedOut, cleanup: () => { window.clearTimeout(timer); signal?.removeEventListener('abort', abort); } };
}

async function request<T>(url: string, init: RequestInit, externalSignal?: AbortSignal): Promise<T> {
  const tc = withTimeout(externalSignal, REQUEST_TIMEOUT_MS);
  try {
    const headers = await authHeaders();
    const response = await fetch(url, { ...init, signal: tc.controller.signal, credentials: 'include', headers: { 'Content-Type': 'application/json', ...headers, ...(init.headers ?? {}) } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body?.error?.message ?? body?.detail ?? body?.message ?? `AI gateway request failed (${response.status})`);
    return body as T;
  } catch (error) {
    if (tc.timedOut()) throw new AIGatewayTimeoutError('AI gateway javob bermadi. Internet yoki AI gateway holatini tekshiring.');
    throw error;
  } finally { tc.cleanup(); }
}

const isNotFound = (error: unknown) => error instanceof Error && /(?:\b404\b|not found)/i.test(error.message);

async function legacyDetectIntent(input: AIIntentRequest): Promise<AIIntentResponse> {
  const detected = detectIntent(input.message);
  return { route: detected.intent === 'image' ? 'image' : 'chat', confidence: 1, requiresClarification: false };
}

async function legacyStream(input: AIGenerateRequest, onEvent: (event: AIStreamEvent) => void, signal?: AbortSignal) {
  if (!LEGACY_AI_ASSISTANT) throw new Error('Supabase AI endpoint is not configured');
  const tc = withTimeout(signal, REQUEST_TIMEOUT_MS);
  try {
    const headers = await authHeaders();
    const response = await fetch(LEGACY_AI_ASSISTANT, { method: 'POST', credentials: 'include', signal: tc.controller.signal, headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', ...headers }, body: JSON.stringify({ messages: [...(input.history ?? []), { role: 'user', content: input.message }], userId: input.userId, context: [input.projectInstructions ? `Project instructions: ${input.projectInstructions}` : '', ...(input.memoryContext ?? []).map((item) => `Memory: ${item}`), input.attachments?.length ? `Attachments: ${input.attachments.map((a) => a.name).join(', ')}` : ''].filter(Boolean).join('\n') }) });
    if (!response.ok || !response.body) throw new Error(`Legacy AI service failed (${response.status})`);
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; const messageId = crypto.randomUUID();
    while (true) { const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const frames = buffer.split(/\r?\n\r?\n/); buffer = frames.pop() ?? ''; for (const frame of frames) { const data = frame.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n'); if (!data || data === '[DONE]') continue; try { const parsed = JSON.parse(data); const delta = parsed.choices?.[0]?.delta?.content; if (delta) onEvent({ type: 'message.delta', delta }); } catch { /* ignore malformed provider frame */ } } }
    onEvent({ type: 'message.completed', messageId });
    try { await reader.cancel(); } catch { /* noop */ } reader.releaseLock();
  } finally { tc.cleanup(); }
}

export const aiGatewayClient = {
  async detectIntent(input: AIIntentRequest, signal?: AbortSignal): Promise<AIIntentResponse> {
    try { return await request<AIIntentResponse>(AI_WORKSPACE_API.intent, { method: 'POST', body: JSON.stringify(input) }, signal); }
    catch (error) { if (!isNotFound(error)) throw error; return legacyDetectIntent(input); }
  },
  generate(input: AIGenerateRequest, signal?: AbortSignal): Promise<{ messageId: string; conversationId: string; route: AIRoute }> {
    return request(AI_WORKSPACE_API.generate, { method: 'POST', body: JSON.stringify(input) }, signal);
  },
  async stream(input: AIGenerateRequest, onEvent: (event: AIStreamEvent) => void, signal?: AbortSignal): Promise<void> {
    try { await this.streamGateway(input, onEvent, signal); }
    catch (error) { if (!isNotFound(error)) throw error; await legacyStream(input, onEvent, signal); }
  },
  async streamGateway(input: AIGenerateRequest, onEvent: (event: AIStreamEvent) => void, signal?: AbortSignal): Promise<void> {
    const tc = withTimeout(signal, REQUEST_TIMEOUT_MS); let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
    try {
      const headers = await authHeaders();
      const response = await fetch(AI_WORKSPACE_API.stream, { method: 'POST', credentials: 'include', signal: tc.controller.signal, headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream', ...headers }, body: JSON.stringify(input) });
      if (!response.ok || !response.body) { const body = await response.json().catch(() => ({})); throw new Error(body?.error?.message ?? body?.detail ?? body?.message ?? `AI stream failed (${response.status})`); }
      tc.cleanup();
      reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let doneByServer = false;
      while (!doneByServer) {
        let idleTimer: number | undefined;
        const result = await Promise.race([reader.read(), new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => { idleTimer = window.setTimeout(() => reject(new AIGatewayTimeoutError('AI stream 90 soniya davomida yangi ma’lumot yubormadi.')), STREAM_IDLE_TIMEOUT_MS); })]);
        if (idleTimer !== undefined) window.clearTimeout(idleTimer);
        if (result.done) break;
        buffer += decoder.decode(result.value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/); buffer = frames.pop() ?? '';
        for (const frame of frames) {
          const data = frame.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n');
          if (!data) continue; if (data === '[DONE]') { doneByServer = true; break; }
          try { onEvent(JSON.parse(data) as AIStreamEvent); } catch { /* ignore malformed SSE */ }
        }
      }
      buffer += decoder.decode();
      if (buffer.trim() && !doneByServer) { const data = buffer.split(/\r?\n/).filter((line) => line.startsWith('data:')).map((line) => line.slice(5).trim()).join('\n'); if (data && data !== '[DONE]') { try { onEvent(JSON.parse(data) as AIStreamEvent); } catch { /* ignore */ } } }
    } catch (error) { if (tc.timedOut()) throw new AIGatewayTimeoutError('AI stream ulanishi vaqtida javob kelmadi.'); throw error; }
    finally { tc.cleanup(); if (reader) { try { await reader.cancel(); } catch { /* noop */ } try { reader.releaseLock(); } catch { /* noop */ } } }
  },
};
