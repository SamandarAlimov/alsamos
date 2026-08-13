import { AI_WORKSPACE_API, type AIModelMode } from './aiWorkspaceArchitecture';

export type AIRoute = 'chat' | 'image' | 'video' | 'document' | 'code' | 'spreadsheet' | 'slides' | 'diagram';
export interface AIIntentRequest { message: string; conversationId?: string; projectId?: string; projectInstructions?: string; memoryContext?: string[]; modelMode?: AIModelMode; hintedRoute?: AIRoute; attachments?: Array<{ id: string; name: string; mimeType: string }> }
export interface AIIntentResponse { route: AIRoute; confidence: number; requiresClarification: boolean; clarification?: string }
export interface AIGenerateRequest extends AIIntentRequest { route: AIRoute; skillIds?: string[] }
export interface AIStreamEvent { type: 'message.delta' | 'message.completed' | 'artifact.created' | 'task.updated' | 'error'; delta?: string; messageId?: string; artifactId?: string; taskId?: string; error?: { code: string; message: string; retryable: boolean } }

const REQUEST_TIMEOUT_MS = 30_000;
const STREAM_IDLE_TIMEOUT_MS = 90_000;

export class AIGatewayTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIGatewayTimeoutError';
  }
}

interface RequestController {
  signal: AbortSignal;
  didTimeout: () => boolean;
  stopTimeout: () => void;
  cleanup: () => void;
}

function createRequestController(externalSignal: AbortSignal | undefined, timeoutMs: number): RequestController {
  const controller = new AbortController();
  let timedOut = false;
  let timeoutActive = true;
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onAbort = () => controller.abort(externalSignal?.reason);

  if (externalSignal?.aborted) onAbort();
  else externalSignal?.addEventListener('abort', onAbort, { once: true });

  return {
    signal: controller.signal,
    didTimeout: () => timedOut,
    stopTimeout: () => {
      if (!timeoutActive) return;
      timeoutActive = false;
      window.clearTimeout(timeout);
    },
    cleanup: () => {
      if (timeoutActive) window.clearTimeout(timeout);
      timeoutActive = false;
      externalSignal?.removeEventListener('abort', onAbort);
    },
  };
}

async function request<T>(url: string, init: RequestInit, externalSignal?: AbortSignal): Promise<T> {
  const requestController = createRequestController(externalSignal, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      signal: requestController.signal,
      headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
      credentials: 'include',
    });
    requestController.stopTimeout();
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body?.error?.message ?? body?.message ?? `AI gateway request failed (${response.status})`);
    return body as T;
  } catch (error) {
    if (requestController.didTimeout()) throw new AIGatewayTimeoutError('AI gateway javob bermadi. Internet yoki AI gateway holatini tekshiring.');
    throw error;
  } finally {
    requestController.cleanup();
  }
}

const processSSEFrame = (frame: string, onEvent: (event: AIStreamEvent) => void): boolean => {
  const data = frame
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n');

  if (!data) return false;
  if (data === '[DONE]') return true;

  try {
    onEvent(JSON.parse(data) as AIStreamEvent);
  } catch {
    // Ignore malformed SSE frames; the stream remains alive and later valid frames can render.
  }
  return false;
};

export const aiGatewayClient = {
  detectIntent(input: AIIntentRequest, signal?: AbortSignal): Promise<AIIntentResponse> {
    return request<AIIntentResponse>(AI_WORKSPACE_API.intent, { method: 'POST', body: JSON.stringify(input) }, signal);
  },

  generate(input: AIGenerateRequest, signal?: AbortSignal): Promise<{ messageId: string; conversationId: string; route: AIRoute }> {
    return request(AI_WORKSPACE_API.generate, { method: 'POST', body: JSON.stringify(input) }, signal);
  },

  async stream(input: AIGenerateRequest, onEvent: (event: AIStreamEvent) => void, signal?: AbortSignal): Promise<void> {
    const requestController = createRequestController(signal, REQUEST_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(AI_WORKSPACE_API.stream, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify(input),
        signal: requestController.signal,
      });
      requestController.stopTimeout();

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error?.message ?? body?.message ?? `AI stream failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let doneByServer = false;

      const readWithIdleTimeout = async (): Promise<ReadableStreamReadResult<Uint8Array>> => {
        let timer: number | undefined;
        try {
          return await Promise.race([
            reader.read(),
            new Promise<ReadableStreamReadResult<Uint8Array>>((_, reject) => {
              timer = window.setTimeout(() => reject(new AIGatewayTimeoutError('AI stream 90 soniya davomida yangi ma’lumot yubormadi.')), STREAM_IDLE_TIMEOUT_MS);
            }),
          ]);
        } finally {
          if (timer !== undefined) window.clearTimeout(timer);
        }
      };

      try {
        while (true) {
          const { value, done } = await readWithIdleTimeout();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split(/\r?\n\r?\n/);
          buffer = frames.pop() ?? '';
          for (const frame of frames) {
            if (processSSEFrame(frame, onEvent)) {
              doneByServer = true;
              break;
            }
          }
          if (doneByServer) break;
        }
        buffer += decoder.decode();
        if (!doneByServer && buffer.trim()) processSSEFrame(buffer, onEvent);
      } finally {
        try { await reader.cancel(); } catch { /* stream is already closed */ }
        reader.releaseLock();
      }
    } catch (error) {
      if (requestController.didTimeout()) throw new AIGatewayTimeoutError('AI stream ulanishi vaqtida javob kelmadi.');
      throw error;
    } finally {
      requestController.cleanup();
    }
  },
};