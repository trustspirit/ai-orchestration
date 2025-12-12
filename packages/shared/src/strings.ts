/**
 * Centralized string management for the AI Orchestration Service
 * All user-facing text should be defined here for easy localization
 */

export const Strings = {
  // App General
  app: {
    name: 'AI Orchestrator',
    description: 'Multi-AI Orchestration Service',
    tagline: 'Harness the power of multiple AI models',
  },

  // Navigation
  nav: {
    home: 'Home',
    chat: 'Chat',
    settings: 'Settings',
    providers: 'AI Providers',
    history: 'History',
  },

  // Chat Interface
  chat: {
    placeholder: 'Type your message here...',
    send: 'Send',
    clear: 'Clear',
    thinking: 'AI models are thinking...',
    noProviders: 'No AI providers available. Please configure API keys.',
    selectProviders: 'Select AI Models',
    consensus: 'Consensus Response',
    individualResponses: 'Individual AI Responses',
    agreementLevel: {
      high: 'High Agreement',
      medium: 'Medium Agreement',
      low: 'Low Agreement',
    },
  },

  // Providers
  providers: {
    openai: {
      name: 'OpenAI',
      description: 'GPT-4 and GPT-3.5 models',
    },
    gemini: {
      name: 'Google Gemini',
      description: 'Gemini Pro and Ultra models',
    },
    claude: {
      name: 'Anthropic Claude',
      description: 'Claude 3 Opus, Sonnet, and Haiku',
    },
    perplexity: {
      name: 'Perplexity',
      description: 'Real-time web-connected AI',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    apiKeys: 'API Keys',
    apiKeyPlaceholder: 'Enter your API key',
    saveSettings: 'Save Settings',
    defaultRole: 'Default AI Role',
    customRoles: 'Custom Roles',
    addRole: 'Add Role',
    roleName: 'Role Name',
    rolePrompt: 'Role Prompt',
  },

  // Roles
  roles: {
    default: 'You are a helpful AI assistant.',
    analyst: 'You are an expert analyst who provides detailed, data-driven insights.',
    creative: 'You are a creative thinker who generates innovative and imaginative ideas.',
    technical: 'You are a technical expert who provides precise, detailed technical explanations.',
    educator: 'You are a patient educator who explains concepts clearly and simply.',
    researcher:
      'You are a thorough researcher who provides well-sourced and comprehensive information.',
  },

  // Errors
  errors: {
    networkError: 'Network error. Please check your connection.',
    apiError: 'API error occurred. Please try again.',
    noResponse: 'No response received from AI providers.',
    invalidInput: 'Please enter a valid message.',
    providerUnavailable: 'This AI provider is currently unavailable.',
  },

  // Actions
  actions: {
    copy: 'Copy',
    copied: 'Copied!',
    retry: 'Retry',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    expand: 'Expand',
    collapse: 'Collapse',
  },

  // Status
  status: {
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    connected: 'Connected',
    disconnected: 'Disconnected',
  },
} as const;

export type StringsType = typeof Strings;
