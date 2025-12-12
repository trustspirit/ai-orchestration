export interface AiResponse {
  provider: string;
  content: string;
  timestamp: Date;
}

export type AiProviderName = 'openai' | 'gemini' | 'claude' | 'perplexity';

export interface UserConfig {
  activeProviders: AiProviderName[];
  roles: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: AiProviderName;
}

export interface OrchestrationResponse {
  query: string;
  responses: ProviderResponse[];
  consensus: ConsensusResult;
  timestamp: Date;
}

export interface ProviderResponse {
  provider: AiProviderName;
  content: string;
  model: string;
  latencyMs: number;
  usage?: TokenUsage;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ConsensusResult {
  summary: string;
  agreementLevel: 'high' | 'medium' | 'low';
  keyPoints: string[];
  differences: string[];
}

export interface RoleConfig {
  id: string;
  name: string;
  prompt: string;
  isDefault?: boolean;
}

export interface ProviderStatus {
  name: AiProviderName;
  available: boolean;
  displayName: string;
  description: string;
}

// 프로바이더별 설정
export interface ProviderConfig {
  provider: AiProviderName;
  model: string;
  systemPrompt: string;
  enabled: boolean;
}

// 사용 가능한 모델 목록
export const AVAILABLE_MODELS: Record<
  AiProviderName,
  { id: string; name: string; description: string }[]
> = {
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable, multimodal' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and affordable' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'High intelligence with vision' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
  ],
  gemini: [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Best for complex tasks' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and versatile' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Balanced performance' },
  ],
  claude: [
    {
      id: 'claude-sonnet-4-20250514',
      name: 'Claude Sonnet 4',
      description: 'Latest and most capable',
    },
    {
      id: 'claude-3-5-sonnet-20241022',
      name: 'Claude 3.5 Sonnet',
      description: 'Best for most tasks',
    },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fast and compact' },
  ],
  perplexity: [
    {
      id: 'llama-3.1-sonar-large-128k-online',
      name: 'Sonar Large',
      description: 'Real-time web search',
    },
    {
      id: 'llama-3.1-sonar-small-128k-online',
      name: 'Sonar Small',
      description: 'Fast web search',
    },
    {
      id: 'llama-3.1-sonar-huge-128k-online',
      name: 'Sonar Huge',
      description: 'Most comprehensive',
    },
  ],
};

// 기본 역할 프롬프트
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

export const AI_PROVIDER_INFO: Record<
  AiProviderName,
  { displayName: string; description: string; color: string }
> = {
  openai: {
    displayName: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    color: '#10a37f',
  },
  gemini: {
    displayName: 'Google Gemini',
    description: 'Gemini Pro and Ultra models',
    color: '#4285f4',
  },
  claude: {
    displayName: 'Anthropic Claude',
    description: 'Claude 3 Opus, Sonnet, and Haiku',
    color: '#d97757',
  },
  perplexity: {
    displayName: 'Perplexity',
    description: 'Real-time web-connected AI',
    color: '#20b8cd',
  },
};
