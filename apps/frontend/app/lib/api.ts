import type { AiProviderName, OrchestrationResponse, ProviderConfig } from '@repo/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ProviderInfo {
  name: AiProviderName;
  available: boolean;
  displayName: string;
  description: string;
  color: string;
  defaultModel: string;
  models: { id: string; name: string; description: string }[];
}

export interface ProviderSetting {
  provider: AiProviderName;
  model?: string;
  systemPrompt?: string;
  enabled: boolean;
}

export interface ChatRequest {
  prompt: string;
  providerSettings: ProviderSetting[];
  globalSystemRole?: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export async function fetchProviders(): Promise<ProviderInfo[]> {
  const response = await fetch(`${API_BASE_URL}/orchestration/providers`);
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }
  const data = await response.json();
  return data.providers;
}

export async function fetchProviderModels(provider: AiProviderName): Promise<{
  provider: AiProviderName;
  models: { id: string; name: string; description: string }[];
  defaultModel: string;
}> {
  const response = await fetch(`${API_BASE_URL}/orchestration/providers/${provider}/models`);
  if (!response.ok) {
    throw new Error('Failed to fetch provider models');
  }
  return response.json();
}

export async function sendChatMessage(request: ChatRequest): Promise<OrchestrationResponse> {
  const response = await fetch(`${API_BASE_URL}/orchestration/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}

export async function checkHealth(): Promise<{ status: string; availableProviders: AiProviderName[] }> {
  const response = await fetch(`${API_BASE_URL}/orchestration/health`);
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  return response.json();
}
