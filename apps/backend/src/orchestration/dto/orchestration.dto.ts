import { AiProviderName } from '@repo/shared';

export class ProviderSettingDto {
  provider: AiProviderName;
  model?: string;
  systemPrompt?: string;
  enabled: boolean;
}

export class CreateOrchestrationDto {
  prompt: string;
  providerSettings: ProviderSettingDto[];
  globalSystemRole?: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export class ProviderConfigDto {
  name: AiProviderName;
  enabled: boolean;
  model?: string;
  systemPrompt?: string;
}

export class UserSettingsDto {
  providers: ProviderConfigDto[];
  defaultRole?: string;
}
