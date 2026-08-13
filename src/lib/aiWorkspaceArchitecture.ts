export type AIModelMode = 'fast' | 'thinking';
export type AIArtifactType = 'document' | 'code' | 'image' | 'spreadsheet' | 'slides' | 'diagram';
export type AIConnectorKind = 'google-drive' | 'gmail' | 'calendar' | 'notion' | 'github' | 'bozor' | 'tolov' | 'xarita';
export type AIAgentTaskStatus = 'queued' | 'running' | 'waiting-confirmation' | 'completed' | 'failed' | 'cancelled';
export interface AIProject { id: string; ownerId: string; name: string; icon?: string; color?: string; instructions?: string; createdAt: string; updatedAt: string; }
export interface AIArtifact { id: string; conversationId?: string; projectId?: string; ownerId: string; type: AIArtifactType; title: string; version: number; mimeType: string; storagePath?: string; previewUrl?: string; createdAt: string; updatedAt: string; }
export interface AIConnector { id: string; ownerId: string; kind: AIConnectorKind; displayName: string; connected: boolean; accountLabel?: string; updatedAt: string; }
export interface AISkill { id: string; name: string; description: string; enabled: boolean; scope: 'global' | 'chat' | 'project'; }
export interface AIAgentTask { id: string; conversationId: string; title: string; status: AIAgentTaskStatus; steps: Array<{ id: string; label: string; status: AIAgentTaskStatus }>; requiresConfirmation: boolean; createdAt: string; updatedAt: string; }
export const AI_WORKSPACE_API = { projects: '/api/v1/ai/projects', artifacts: '/api/v1/ai/artifacts', conversationsSearch: '/api/v1/ai/conversations/search', connectors: '/api/v1/ai/connectors', skills: '/api/v1/ai/skills', tasks: '/api/v1/ai/tasks', intent: '/api/v1/ai/intent', generate: '/api/v1/ai/generate', stream: '/api/v1/ai/stream' } as const;
export const AI_WORKSPACE_RULES = [
  'Entering /ai always creates a fresh chat session.',
  'Image/video/document generation is intent-routed; Chat and Imagine are not separate modes.',
  'UI never calls model/provider SDKs directly; provider selection belongs behind the AI gateway.',
  'Projects, artifacts, connectors and skills are server-backed domain entities.',
  'External/destructive actions require explicit confirmation before execution.',
  'Streaming is abortable and failures render inline with retry.',
  'Durable state is server-authoritative; local state is ephemeral UI/cache state.',
] as const;
