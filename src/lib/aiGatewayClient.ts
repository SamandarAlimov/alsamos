import { AI_WORKSPACE_API, type AIModelMode } from './aiWorkspaceArchitecture';

export type AIRoute = 'chat' | 'image' | 'video' | 'document' | 'code' | 'spreadsheet' | 'slides' | 'diagram';
export interface AIIntentRequest { message: string; conversationId?: string; projectId?: string; modelMode?: AIModelMode; hintedRoute?: AIRoute; attachments?: Array<{ id: string; name: string; mimeType: string }> }
export interface AIIntentResponse { route: AIRoute; confidence: number; requiresClarification: boolean; clarification?: string }
export interface AIGenerateRequest extends AIIntentRequest { route: AIRoute; skillIds?: string[] }
export interface AIStreamEvent { type: 'message.delta' | 'message.completed' | 'artifact.created' | 'task.updated' | 'error'; delta?: string; messageId?: string; artifactId?: string; taskId?: string; error?: { code: string; message: string; retryable: boolean } }

async function request<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) }, credentials: 'include' });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message ?? body?.message ?? `AI gateway request failed (${response.status})`);
  return body as T;
}

export const aiGatewayClient = {
  detectIntent(input: AIIntentRequest, signal?: AbortSignal): Promise<AIIntentResponse> { return request<AIIntentResponse>(AI_WORKSPACE_API.intent, { method: 'POST', body: JSON.stringify(input), signal }); },
  generate(input: AIGenerateRequest, signal?: AbortSignal): Promise<{ messageId: string; conversationId: string; route: AIRoute }> { return request(AI_WORKSPACE_API.generate, { method: 'POST', body: JSON.stringify(input), signal }); },
  async stream(input: AIGenerateRequest, onEvent: (event: AIStreamEvent) => void, signal?: AbortSignal): Promise<void> {
    const response = await fetch(AI_WORKSPACE_API.stream, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body: JSON.stringify(input), signal });
    if (!response.ok || !response.body) throw new Error(`AI stream failed (${response.status})`);
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read(); if (done) break;
        buffer += decoder.decode(value, { stream: true }); const frames = buffer.split('\n\n'); buffer = frames.pop() ?? '';
        for (const frame of frames) { const data = frame.split('\n').find((line) => line.startsWith('data:'))?.slice(5).trim(); if (!data || data === '[DONE]') continue; try { onEvent(JSON.parse(data) as AIStreamEvent); } catch { /* gateway owns SSE correctness */ } }
      }
    } finally { reader.releaseLock(); }
  },
};
