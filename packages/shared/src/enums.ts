/**
 * AI Provider Names
 */
export enum AiProvider {
  OpenAI = 'openai',
  Gemini = 'gemini',
  Claude = 'claude',
  Perplexity = 'perplexity',
}

/**
 * Chat message roles
 */
export enum ChatRole {
  User = 'user',
  Assistant = 'assistant',
}

/**
 * Agreement level for consensus
 */
export enum AgreementLevel {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

/**
 * UI Status indicators
 */
export enum Status {
  Active = 'active',
  Ready = 'ready',
  Offline = 'offline',
  Loading = 'loading',
}

/**
 * Button variants
 */
export enum ButtonVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
  Glass = 'glass',
}

/**
 * Component sizes
 */
export enum ComponentSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

/**
 * Card variants
 */
export enum CardVariant {
  Default = 'default',
  Elevated = 'elevated',
  Outlined = 'outlined',
  Glass = 'glass',
}

/**
 * Badge variants
 */
export enum BadgeVariant {
  Default = 'default',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Info = 'info',
}

/**
 * Avatar variants
 */
export enum AvatarVariant {
  User = 'user',
  AI = 'ai',
  System = 'system',
}
