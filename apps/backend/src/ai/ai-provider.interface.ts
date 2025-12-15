import { AiProviderName } from '@repo/shared';

export interface AiProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  systemPrompt?: string;
  model?: string; // 동적 모델 지정
  maxTokens?: number;
  temperature?: number;
}

export interface AiCompletionResponse {
  provider: AiProviderName;
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
  citations?: CitationInfo[]; // Citations from Perplexity or other sources
}

export interface CitationInfo {
  index: number;
  url: string;
  title?: string;
}

export interface AiProvider {
  readonly name: AiProviderName;
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
  isAvailable(): boolean;
  getDefaultModel(): string;
}
