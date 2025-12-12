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
  // For assistant messages - include individual responses
  responses?: ProviderResponse[];
  consensus?: ConsensusResult;
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
    // GPT-5.2 계열 (Latest)
    {
      id: 'gpt-5.2-instant',
      name: 'GPT-5.2 Instant',
      description: 'Latest: fastest and most affordable',
    },
    { id: 'gpt-5.2-thinking', name: 'GPT-5.2 Thinking', description: 'Latest: enhanced reasoning' },
    { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', description: 'Latest: maximum capability' },
    // GPT-5.1 계열
    { id: 'gpt-5.1', name: 'GPT-5.1', description: 'Coding & agent optimized' },
    { id: 'gpt-5', name: 'GPT-5', description: 'Previous generation GPT-5' },
    { id: 'gpt-5-pro', name: 'GPT-5 Pro', description: 'Enhanced GPT-5 version' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini', description: 'Fast and cost-effective' },
    // GPT-4.1 계열
    { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Tool calling & instruction following' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Compact GPT-4.1' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: 'Fastest, most affordable' },
    // o-시리즈 (추론)
    { id: 'o4-mini', name: 'o4 Mini', description: 'Fast and affordable reasoning' },
    { id: 'o3', name: 'o3', description: 'Advanced reasoning model' },
    { id: 'o3-pro', name: 'o3 Pro', description: 'Enhanced o3 with more compute' },
    { id: 'o3-mini', name: 'o3 Mini', description: 'Compact reasoning model' },
    { id: 'o1', name: 'o1', description: 'Original o-series model' },
  ],
  gemini: [
    // Gemini 3 계열
    { id: 'gemini-3', name: 'Gemini 3', description: 'Latest flagship model' },
    { id: 'gemini-3-pro', name: 'Gemini 3 Pro', description: 'Enhanced Gemini 3' },
    // Nano Banana 계열
    { id: 'nano-banana', name: 'Nano Banana', description: 'Fast and efficient' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro', description: 'Enhanced Nano Banana' },
    // Veo 계열 (Video)
    { id: 'veo-3.1', name: 'Veo 3.1', description: 'Video generation model' },
    { id: 'veo-3.1-fast', name: 'Veo 3.1 Fast', description: 'Fast video generation' },
    // 이전 세대
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Previous generation Pro' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Previous generation Flash' },
  ],
  claude: [
    // Claude 4.5 계열 (Latest)
    { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', description: 'Most powerful and capable' },
    { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', description: 'Balanced performance' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', description: 'Fast and compact' },
    // Claude 4 계열
    {
      id: 'claude-sonnet-4-20250514',
      name: 'Claude Sonnet 4',
      description: 'Previous generation Sonnet',
    },
    // Claude 3.5 계열
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Legacy Sonnet' },
  ],
  perplexity: [
    {
      id: 'sonar',
      name: 'Sonar',
      description: 'Fast and efficient, real-time web search',
    },
    {
      id: 'sonar-pro',
      name: 'Sonar Pro',
      description: 'Advanced model with better reasoning',
    },
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
