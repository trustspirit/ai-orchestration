'use client';

import { Card, Button, Input, Toggle, Textarea, Badge, Select, Spinner } from '@repo/ui';
import {
  Strings,
  AI_PROVIDER_INFO,
  AVAILABLE_MODELS,
  DEFAULT_PROVIDER_PROMPTS,
} from '@repo/shared';
import type { AiProviderName, RoleConfig } from '@repo/shared';
import { Header, ProviderIcon } from '../components';
import { useSettings } from '../hooks/useSettings';

const defaultRoles: RoleConfig[] = [
  { id: 'default', name: 'Default Assistant', prompt: Strings.roles.default, isDefault: true },
  { id: 'analyst', name: 'Analyst', prompt: Strings.roles.analyst },
  { id: 'creative', name: 'Creative', prompt: Strings.roles.creative },
  { id: 'technical', name: 'Technical Expert', prompt: Strings.roles.technical },
  { id: 'educator', name: 'Educator', prompt: Strings.roles.educator },
  { id: 'researcher', name: 'Researcher', prompt: Strings.roles.researcher },
];

export default function SettingsPage() {
  const {
    providers,
    providerSettings,
    globalRole,
    isLoading,
    error,
    updateProviderSetting,
    updateGlobalRole,
    resetToDefaults,
  } = useSettings();

  const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

  const getSetting = (provider: AiProviderName) => {
    return (
      providerSettings.find((s) => s.provider === provider) || {
        provider,
        enabled: false,
        model: undefined,
        systemPrompt: undefined,
      }
    );
  };

  const getProviderInfo = (provider: AiProviderName) => {
    return providers.find((p) => p.name === provider);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[80px]" />
      </div>

      <Header />

      <main className="relative pt-28 pb-8 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{Strings.settings.title}</h1>
          <Button variant="secondary" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>

        {error && (
          <Card variant="default" padding="md" className="mb-6 border-amber-500/30 bg-amber-500/10">
            <p className="text-amber-400">Warning: {error}</p>
          </Card>
        )}

        {/* Global Role Selection */}
        <Card variant="elevated" padding="lg" className="mb-6 overflow-visible relative z-20">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Default AI Role
          </h2>

          <Select
            label="Select the default role for all AI providers"
            options={defaultRoles.map((role) => ({
              value: role.id,
              label: role.name,
              description: role.prompt.slice(0, 60) + '...',
            }))}
            value={globalRole}
            onChange={updateGlobalRole}
          />

          <p className="text-sm text-gray-400 mt-4">
            This role applies to all providers unless overridden with a custom prompt.
          </p>
        </Card>

        {/* AI Providers Section */}
        <Card variant="elevated" padding="lg" className="mb-6 overflow-visible relative z-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {Strings.nav.providers}
          </h2>

          <div className="space-y-4">
            {allProviders.map((provider) => {
              const info = AI_PROVIDER_INFO[provider];
              const setting = getSetting(provider);
              const providerInfo = getProviderInfo(provider);
              const isAvailable = providerInfo?.available ?? false;
              const models = AVAILABLE_MODELS[provider] || [];

              return (
                <div
                  key={provider}
                  className={`p-4 rounded-xl bg-white/5 border border-white/10 ${
                    !isAvailable ? 'opacity-60' : ''
                  }`}
                >
                  {/* Provider Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${info.color}20`, color: info.color }}
                      >
                        <ProviderIcon provider={provider} className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{info.displayName}</h3>
                          {isAvailable ? (
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-heartbeat" />
                          ) : (
                            <Badge variant="warning" size="sm">
                              API Key Missing
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{info.description}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={setting.enabled}
                      onChange={(checked) => updateProviderSetting(provider, { enabled: checked })}
                      disabled={!isAvailable}
                      size="lg"
                    />
                  </div>

                  {/* Provider Settings */}
                  {setting.enabled && isAvailable && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      {/* Model Selection */}
                      <Select
                        label="Model"
                        options={models.map((m) => ({
                          value: m.id,
                          label: m.name,
                          description: m.description,
                        }))}
                        value={setting.model || providerInfo?.defaultModel || models[0]?.id || ''}
                        onChange={(value) => updateProviderSetting(provider, { model: value })}
                      />

                      {/* Custom System Prompt */}
                      <Textarea
                        label="Custom System Prompt (Optional)"
                        placeholder={DEFAULT_PROVIDER_PROMPTS[provider]}
                        value={setting.systemPrompt || ''}
                        onChange={(e) =>
                          updateProviderSetting(provider, { systemPrompt: e.target.value })
                        }
                        rows={3}
                      />

                      <p className="text-xs text-gray-500">
                        Leave empty to use the global role. Custom prompts override the global
                        setting for this provider only.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400">
              <strong>Tip:</strong> API keys are configured on the server. Contact your
              administrator to add or update provider credentials.
            </p>
          </div>
        </Card>

        {/* Settings Info */}
        <Card variant="default" padding="md">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-300">
                Settings are automatically saved to your browser&apos;s local storage.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Your preferences will persist across sessions on this device.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
