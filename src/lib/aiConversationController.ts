import { useCallback, useEffect, useRef, useState } from 'react';
import { aiGatewayClient, type AIStreamEvent, type AIGenerateRequest, type AIRoute } from './aiGatewayClient';
import { detectIntent } from './aiIntent';
import { aiMemoryRepository } from './aiMemoryRepository';
import { aiWorkspaceRepository } from './aiWorkspaceRepository';
import { aiSkillRepository } from './aiSkillRepository';
import { supabase } from '@/integrations/supabase/client';

export interface AIConversationMessage { id: string; role: 'user' | 'assistant'; content: string; status?: 'streaming' | 'completed' | 'error'; route?: AIRoute; artifactId?: string; taskId?: string; error?: { message: string; retryable: boolean } }
export interface SendAIMessageOptions { conversationId?: string; projectId?: string; modelMode?: AIGenerateRequest['modelMode']; skillIds?: string[]; attachments?: AIGenerateRequest['attachments']; memoryContext?: string[] }
export interface AIConversationControllerState { messages: AIConversationMessage[]; busy: boolean; error: string | null; activeRoute: AIRoute | null; artifactIds: string[]; taskIds: string[] }

const makeId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const idleState = (): AIConversationControllerState => ({ messages: [], busy: false, error: null, activeRoute: null, artifactIds: [], taskIds: [] });

export function useAIConversationController() {
  const [state, setState] = useState<AIConversationControllerState>(idleState);
  const messagesRef = useRef<AIConversationMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const selectedProjectRef = useRef<string | null>(null);
  const selectedProjectInstructionsRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    messagesRef.current = state.messages;
  }, [state.messages]);

  useEffect(() => {
    const onProjectSelected = (event: Event) => {
      const detail = (event as CustomEvent<{ projectId?: string | null; instructions?: string | null }>).detail;
      selectedProjectRef.current = detail?.projectId ?? null;
      selectedProjectInstructionsRef.current = detail?.instructions?.trim() || undefined;
    };
    window.addEventListener('alsamos:select-ai-project', onProjectSelected);
    return () => window.removeEventListener('alsamos:select-ai-project', onProjectSelected);
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState((s) => ({ ...s, busy: false, messages: s.messages.map((m) => m.status === 'streaming' ? { ...m, status: 'completed' } : m) }));
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    selectedProjectRef.current = null;
    selectedProjectInstructionsRef.current = undefined;
    messagesRef.current = [];
    setState(idleState());
  }, []);

  const hydrate = useCallback((messages: AIConversationMessage[]) => {
    abortRef.current?.abort();
    abortRef.current = null;
    messagesRef.current = messages;
    setState({ messages, busy: false, error: null, activeRoute: messages.at(-1)?.route ?? null, artifactIds: messages.flatMap((m) => m.artifactId ? [m.artifactId] : []), taskIds: messages.flatMap((m) => m.taskId ? [m.taskId] : []) });
  }, []);

  const send = useCallback(async (message: string, options: SendAIMessageOptions = {}) => {
    const text = message.trim();
    if (!text && !options.attachments?.length) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const assistantId = makeId('assistant');
    const detected = detectIntent(text);
    const hintedRoute: AIRoute = detected.intent === 'image' ? 'image' : 'chat';
    let effectiveProjectId = options.projectId ?? selectedProjectRef.current ?? undefined;
    let projectInstructions = selectedProjectInstructionsRef.current;
    let memoryContext = options.memoryContext;
    let skillIds = options.skillIds;

    try {
      if (options.conversationId && options.projectId === undefined) {
        const { data: conversation } = await supabase.from('ai_conversations').select('project_id').eq('id', options.conversationId).maybeSingle();
        effectiveProjectId = conversation?.project_id ?? effectiveProjectId;
      }
      if (effectiveProjectId && !projectInstructions) {
        const project = await aiWorkspaceRepository.getProject(effectiveProjectId);
        projectInstructions = project?.instructions?.trim() || undefined;
      }
      if (!memoryContext) {
        memoryContext = await aiMemoryRepository.enabledContext(30);
      }
      // Resolve all applicable skill scopes. Explicit chat/project bindings take
      // precedence over global bindings, including explicit disables.
      const effectiveSkills = await aiSkillRepository.effectiveSkillIds(options.conversationId, effectiveProjectId);
      skillIds = [...new Set([...(skillIds ?? []), ...effectiveSkills])];
    } catch {
      // Optional context must never make the core chat unavailable.
    }

    if (controller.signal.aborted) return;

    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id;
    const previousMessages = messagesRef.current
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.status !== 'error')
      .map((m) => ({ role: m.role, content: m.content }))
      .filter((m) => m.content.trim().length > 0);

    const base: AIGenerateRequest = {
      message: detected.prompt,
      userId,
      conversationId: options.conversationId,
      projectId: effectiveProjectId,
      projectInstructions,
      memoryContext,
      modelMode: options.modelMode,
      hintedRoute,
      attachments: options.attachments,
      history: previousMessages,
      route: hintedRoute,
      skillIds,
    };

    setState((s) => ({ ...s, busy: true, error: null, activeRoute: hintedRoute, messages: [...s.messages, { id: makeId('user'), role: 'user', content: message, status: 'completed' }, { id: assistantId, role: 'assistant', content: '', status: 'streaming', route: hintedRoute }] }));
    try {
      const intent = await aiGatewayClient.detectIntent(base, controller.signal);
      if (intent.requiresClarification && intent.clarification) {
        setState((s) => ({ ...s, busy: false, activeRoute: intent.route, messages: s.messages.map((m) => m.id === assistantId ? { ...m, content: intent.clarification!, status: 'completed', route: intent.route } : m) }));
        return;
      }
      const request: AIGenerateRequest = { ...base, route: intent.route };
      await aiGatewayClient.stream(request, (event: AIStreamEvent) => {
        if (event.type === 'message.delta') setState((s) => ({ ...s, messages: s.messages.map((m) => m.id === assistantId ? { ...m, content: m.content + (event.delta ?? '') } : m) }));
        else if (event.type === 'message.completed') setState((s) => ({ ...s, busy: false, messages: s.messages.map((m) => m.id === assistantId ? { ...m, id: event.messageId ?? m.id, status: 'completed', route: intent.route } : m) }));
        else if (event.type === 'artifact.created' && event.artifactId) setState((s) => ({ ...s, artifactIds: [...new Set([...s.artifactIds, event.artifactId!])], messages: s.messages.map((m) => m.id === assistantId ? { ...m, artifactId: event.artifactId } : m) }));
        else if (event.type === 'task.updated' && event.taskId) setState((s) => ({ ...s, taskIds: [...new Set([...s.taskIds, event.taskId!])], messages: s.messages.map((m) => m.id === assistantId ? { ...m, taskId: event.taskId } : m) }));
        else if (event.type === 'error') setState((s) => ({ ...s, busy: false, error: event.error?.message ?? 'AI generation failed', messages: s.messages.map((m) => m.id === assistantId ? { ...m, status: 'error', error: { message: event.error?.message ?? 'AI generation failed', retryable: event.error?.retryable ?? false } } : m) }));
      }, controller.signal);
      setState((s) => ({ ...s, busy: false }));
    } catch (error) {
      if (controller.signal.aborted) return;
      const messageText = error instanceof Error ? error.message : 'AI generation failed';
      setState((s) => ({ ...s, busy: false, error: messageText, messages: s.messages.map((m) => m.id === assistantId ? { ...m, status: 'error', error: { message: messageText, retryable: true } } : m) }));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, []);

  return { state, send, stop, clear, hydrate };
}
