import { AiProvider, ChatRole, AgreementLevel } from './enums';

/**
 * Type alias for AiProvider enum values (for backwards compatibility)
 */
export type AiProviderName = `${AiProvider}`;

/**
 * Type alias for ChatRole enum values
 */
export type ChatRoleType = `${ChatRole}`;

/**
 * Type alias for AgreementLevel enum values
 */
export type AgreementLevelType = `${AgreementLevel}`;

/**
 * AI Response from a single provider
 */
export interface AiResponse {
  provider: AiProviderName;
  content: string;
  timestamp: Date;
}

/**
 * User configuration
 */
export interface UserConfig {
  activeProviders: AiProviderName[];
  roles: string[];
}

/**
 * Chat message in the conversation
 */
export interface ChatMessage {
  id: string;
  role: ChatRoleType;
  content: string;
  timestamp: Date;
  provider?: AiProviderName;
  responses?: ProviderResponse[];
  consensus?: ConsensusResult;
}

/**
 * Complete orchestration response
 */
export interface OrchestrationResponse {
  query: string;
  responses: ProviderResponse[];
  consensus: ConsensusResult;
  timestamp: Date;
}

/**
 * Response from a single AI provider
 */
export interface ProviderResponse {
  provider: AiProviderName;
  content: string;
  model: string;
  latencyMs: number;
  usage?: TokenUsage;
}

/**
 * Token usage statistics
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Consensus result from multiple AI responses
 */
export interface ConsensusResult {
  summary: string;
  agreementLevel: AgreementLevelType;
  keyPoints: string[];
  differences: string[];
}

/**
 * Role configuration for AI prompts
 */
export interface RoleConfig {
  id: string;
  name: string;
  prompt: string;
  isDefault?: boolean;
}

/**
 * Provider status information
 */
export interface ProviderStatus {
  name: AiProviderName;
  available: boolean;
  displayName: string;
  description: string;
}

/**
 * Provider configuration
 */
export interface ProviderConfig {
  provider: AiProviderName;
  model: string;
  systemPrompt: string;
  enabled: boolean;
}

/**
 * Model information
 */
export interface ModelInfo {
  id: string;
  name: string;
  description: string;
}

/**
 * Provider display information
 */
export interface ProviderDisplayInfo {
  displayName: string;
  description: string;
  color: string;
}

/**
 * Available models by provider
 */
export const AVAILABLE_MODELS: Record<AiProviderName, ModelInfo[]> = {
  openai: [
    {
      id: 'gpt-5.2-instant',
      name: 'GPT-5.2 Instant',
      description: 'Latest: fastest and most affordable',
    },
    { id: 'gpt-5.2-thinking', name: 'GPT-5.2 Thinking', description: 'Latest: enhanced reasoning' },
    { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', description: 'Latest: maximum capability' },
    { id: 'gpt-5.1', name: 'GPT-5.1', description: 'Coding & agent optimized' },
    { id: 'gpt-5', name: 'GPT-5', description: 'Previous generation GPT-5' },
    { id: 'gpt-5-pro', name: 'GPT-5 Pro', description: 'Enhanced GPT-5 version' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', description: 'Fast and cost-effective' },
    { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Tool calling & instruction following' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Compact GPT-4.1' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: 'Fastest, most affordable' },
    { id: 'o4-mini', name: 'o4 Mini', description: 'Fast and affordable reasoning' },
    { id: 'o3', name: 'o3', description: 'Advanced reasoning model' },
    { id: 'o3-pro', name: 'o3 Pro', description: 'Enhanced o3 with more compute' },
    { id: 'o3-mini', name: 'o3 Mini', description: 'Compact reasoning model' },
    { id: 'o1', name: 'o1', description: 'Original o-series model' },
  ],
  gemini: [
    { id: 'gemini-3', name: 'Gemini 3', description: 'Latest flagship model' },
    { id: 'gemini-3-pro', name: 'Gemini 3 Pro', description: 'Enhanced Gemini 3' },
    { id: 'nano-banana', name: 'Nano Banana', description: 'Fast and efficient' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', description: 'Enhanced Nano Banana' },
    { id: 'veo-3.1', name: 'Veo 3.1', description: 'Video generation model' },
    { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', description: 'Fast video generation' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Previous generation Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Previous generation Flash' },
  ],
  claude: [
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', description: 'Most powerful and capable' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', description: 'Balanced performance' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', description: 'Fast and compact' },
    {
      id: 'claude-sonnet-4-20250514',
      name: 'Claude Sonnet 4',
      description: 'Previous generation Sonnet',
    },
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Legacy Sonnet' },
  ],
  perplexity: [
    { id: 'sonar', name: 'Sonar', description: 'Fast and efficient, real-time web search' },
    { id: 'sonar-pro', name: 'Sonar Pro', description: 'Advanced model with better reasoning' },
    {
      id: 'sonar-reasoning',
      name: 'Sonar Reasoning',
      description: 'Optimized for complex reasoning tasks',
    },
    {
      id: 'sonar-reasoning-pro',
      name: 'Sonar Reasoning Pro',
      description: 'Most powerful reasoning model',
    },
  ],
};

/**
 * Default prompts for each provider
 */
export const DEFAULT_PROVIDER_PROMPTS: Record<AiProviderName, string> = {
  openai:
    'You are a helpful AI assistant powered by OpenAI. Provide clear, accurate, and well-structured responses.',
  gemini:
    'You are a helpful AI assistant powered by Google Gemini. Provide informative and balanced responses.',
  claude:
    'You are a helpful AI assistant powered by Anthropic Claude. Provide thoughtful, nuanced, and harmless responses.',
  perplexity:
    'You are a helpful AI assistant powered by Perplexity with real-time web access. Provide up-to-date and well-researched responses.',
};

/**
 * AI provider display information
 */
export const AI_PROVIDER_INFO: Record<AiProviderName, ProviderDisplayInfo> = {
  openai: {
    displayName: 'OpenAI',
    description: 'GPT-4o, GPT-5, and o-series models',
    color: '#10a37f',
  },
  gemini: {
    displayName: 'Google Gemini',
    description: 'Gemini 3 and Nano Banana models',
    color: '#4285f4',
  },
  claude: {
    displayName: 'Anthropic Claude',
    description: 'Claude 4.5 Opus, Sonnet, and Haiku',
    color: '#d97757',
  },
  perplexity: {
    displayName: 'Perplexity',
    description: 'Sonar models with real-time web search',
    color: '#20b8cd',
  },
};
