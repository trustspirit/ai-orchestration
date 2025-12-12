'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AiProviderName } from '@repo/shared';
import { AI_PROVIDER_INFO, AVAILABLE_MODELS } from '@repo/shared';
import type { ProviderInfo, ProviderSetting } from '../lib/api';
import { fetchProviders } from '../lib/api';
import { saveSettings, loadSettings, createDefaultSettings } from '../lib/storage';

export interface SettingsState {
  providers: ProviderInfo[];
  providerSettings: ProviderSetting[];
  globalRole: string;
  isLoading: boolean;
  error: string | null;
}

// Create default providers when backend is unavailable (all marked as unavailable)
function createDefaultProviders(): ProviderInfo[] {
  const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];
  return allProviders.map((name) => ({
    name,
    available: false, // All unavailable when backend is not connected
    displayName: AI_PROVIDER_INFO[name].displayName,
    description: AI_PROVIDER_INFO[name].description,
    color: AI_PROVIDER_INFO[name].color,
    defaultModel: AVAILABLE_MODELS[name]?.[0]?.id || '',
    models: AVAILABLE_MODELS[name] || [],
  }));
}

export function useSettings() {
  const [state, setState] = useState<SettingsState>({
    providers: [],
    providerSettings: [],
    globalRole: 'default',
    isLoading: true,
    error: null,
  });

  // Load settings on mount
  useEffect(() => {
    const initializeSettings = async () => {
      try {
        // Fetch available providers from backend
        const providers = await fetchProviders();

        // Load stored settings
        const stored = loadSettings();

        let providerSettings: ProviderSetting[];
        let globalRole = 'default';

        if (stored && stored.providerSettings.length > 0) {
          // Merge stored settings with available providers
          providerSettings = mergeSettings(stored.providerSettings, providers);
          globalRole = stored.globalRole || 'default';
        } else {
          // Create default settings based on available providers
          const defaults: Record<AiProviderName, string> = {} as Record<AiProviderName, string>;
          providers.forEach((p) => {
            defaults[p.name] = p.defaultModel;
          });
          providerSettings = createDefaultSettings(
            providers.filter((p) => p.available).map((p) => p.name),
            defaults,
          );
        }

        setState({
          providers,
          providerSettings,
          globalRole,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        // Backend unavailable - create default providers all marked as unavailable
        const defaultProviders = createDefaultProviders();
        const stored = loadSettings();

        setState({
          providers: defaultProviders,
          providerSettings:
            stored?.providerSettings.map((s) => ({ ...s, enabled: false })) ||
            createDefaultSettings([], {}),
          globalRole: stored?.globalRole || 'default',
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to connect to backend',
        });
      }
    };

    initializeSettings();
  }, []);

  // Update provider setting
  const updateProviderSetting = useCallback(
    (provider: AiProviderName, updates: Partial<ProviderSetting>) => {
      setState((prev) => {
        // Check if provider is available before allowing enable
        const providerInfo = prev.providers.find((p) => p.name === provider);
        if (updates.enabled && providerInfo && !providerInfo.available) {
          // Don't allow enabling unavailable providers
          return prev;
        }

        const newSettings = prev.providerSettings.map((s) =>
          s.provider === provider ? { ...s, ...updates } : s,
        );

        // If provider doesn't exist, add it
        if (!prev.providerSettings.find((s) => s.provider === provider)) {
          newSettings.push({
            provider,
            enabled: false,
            model: undefined,
            systemPrompt: undefined,
            ...updates,
          });
        }

        // Auto-save to localStorage
        saveSettings({
          providerSettings: newSettings,
          globalRole: prev.globalRole,
          updatedAt: new Date().toISOString(),
        });

        return { ...prev, providerSettings: newSettings };
      });
    },
    [],
  );

  // Update global role
  const updateGlobalRole = useCallback((role: string) => {
    setState((prev) => {
      saveSettings({
        providerSettings: prev.providerSettings,
        globalRole: role,
        updatedAt: new Date().toISOString(),
      });
      return { ...prev, globalRole: role };
    });
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setState((prev) => {
      const defaults: Record<AiProviderName, string> = {} as Record<AiProviderName, string>;
      prev.providers.forEach((p) => {
        defaults[p.name] = p.defaultModel;
      });

      const newSettings = createDefaultSettings(
        prev.providers.filter((p) => p.available).map((p) => p.name),
        defaults,
      );

      saveSettings({
        providerSettings: newSettings,
        globalRole: 'default',
        updatedAt: new Date().toISOString(),
      });

      return {
        ...prev,
        providerSettings: newSettings,
        globalRole: 'default',
      };
    });
  }, []);

  return {
    ...state,
    updateProviderSetting,
    updateGlobalRole,
    resetToDefaults,
  };
}

// Merge stored settings with current provider info
function mergeSettings(stored: ProviderSetting[], providers: ProviderInfo[]): ProviderSetting[] {
  const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

  return allProviders.map((provider) => {
    const storedSetting = stored.find((s) => s.provider === provider);
    const providerInfo = providers.find((p) => p.name === provider);

    if (storedSetting) {
      // Use stored setting but check if provider is still available
      return {
        ...storedSetting,
        // If provider is not available, disable it
        enabled: storedSetting.enabled && (providerInfo?.available ?? false),
      };
    }

    // Create new setting for provider
    return {
      provider,
      enabled: providerInfo?.available ?? false,
      model: providerInfo?.defaultModel,
      systemPrompt: undefined,
    };
  });
}
