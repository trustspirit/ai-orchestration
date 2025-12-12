import type { AiProviderName } from '@repo/shared';
import type { ProviderSetting } from './api';

const STORAGE_KEY = 'ai-orchestration-settings';

export interface StoredSettings {
  providerSettings: ProviderSetting[];
  globalRole: string;
  updatedAt: string;
}

export function saveSettings(settings: StoredSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadSettings(): StoredSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return null;
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear settings:', e);
  }
}

export function createDefaultSettings(
  availableProviders: AiProviderName[],
  providerDefaults: Record<AiProviderName, string>,
): ProviderSetting[] {
  const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

  return allProviders.map((provider) => ({
    provider,
    enabled: availableProviders.includes(provider),
    model: providerDefaults[provider] || undefined,
    systemPrompt: undefined,
  }));
}
