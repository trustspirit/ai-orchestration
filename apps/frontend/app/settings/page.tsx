'use client';

import { Card, Button, Toggle, Textarea, Badge, Select, Spinner } from '@repo/ui';
import {
  Strings,
  AI_PROVIDER_INFO,
  AVAILABLE_MODELS,
  DEFAULT_PROVIDER_PROMPTS,
} from '@repo/shared';
import type { AiProviderName, RoleConfig } from '@repo/shared';
import { Header, ProviderIcon, roleOptionsWithInherit } from '../components';
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-white/50 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="relative pt-24 pb-8 px-6 max-w-3xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-white/90">{Strings.settings.title}</h1>
          <Button variant="secondary" size="sm" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-[#ff9f0a]/10 border border-[#ff9f0a]/20">
            <p className="text-[#ff9f0a] text-sm">Warning: {error}</p>
          </div>
        )}

        {/* Global Role Selection */}
        <Card variant="default" padding="md" className="mb-5 overflow-visible relative z-20">
          <h2 className="text-base font-medium text-white/80 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#30d158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Default AI Role
          </h2>

          <Select
            options={defaultRoles.map((role) => ({
              value: role.id,
              label: role.name,
              description: role.prompt.slice(0, 60) + '...',
            }))}
            value={globalRole}
            onChange={updateGlobalRole}
          />

          <p className="text-xs text-white/40 mt-3">
            This role applies to all providers unless overridden with a custom prompt.
          </p>
        </Card>

        {/* AI Providers Section */}
        <Card variant="default" padding="md" className="mb-5 overflow-visible relative z-10">
          <h2 className="text-base font-medium text-white/80 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0071e3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {Strings.nav.providers}
          </h2>

          <div className="space-y-3">
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
                    !isAvailable ? 'opacity-50' : ''
                  }`}
                >
                  {/* Provider Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${info.color}15`, color: info.color }}
                      >
                        <ProviderIcon provider={provider} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm text-white/90">{info.displayName}</h3>
                          {isAvailable ? (
                            <span className="w-2 h-2 rounded-full bg-[#30d158] animate-heartbeat" />
                          ) : (
                            <Badge variant="warning" size="sm">
                              No API Key
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/40">{info.description}</p>
                      </div>
                    </div>
                    <Toggle
                      checked={setting.enabled}
                      onChange={(checked) => updateProviderSetting(provider, { enabled: checked })}
                      disabled={!isAvailable}
                      size="md"
                    />
                  </div>

                  {/* Provider Settings */}
                  {setting.enabled && isAvailable && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
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

                      {/* Role Selection */}
                      <Select
                        label="Role"
                        options={roleOptionsWithInherit}
                        value={setting.role || ''}
                        onChange={(value) => updateProviderSetting(provider, { role: value || undefined })}
                      />

                      {/* Custom System Prompt */}
                      <Textarea
                        label="Custom Prompt (Optional)"
                        placeholder={DEFAULT_PROVIDER_PROMPTS[provider]}
                        value={setting.systemPrompt || ''}
                        onChange={(e) => updateProviderSetting(provider, { systemPrompt: e.target.value })}
                        rows={3}
                      />

                      <p className="text-xs text-white/30">
                        Role overrides the global setting. Custom prompt overrides both.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 px-4 py-3 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20">
            <p className="text-xs text-[#0071e3]">
              <strong>Tip:</strong> API keys are configured on the server. Contact your administrator to update credentials.
            </p>
          </div>
        </Card>

        {/* Settings Info */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
          <svg className="w-5 h-5 text-white/40 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm text-white/60">
              Settings are saved to your browser&apos;s local storage.
            </p>
            <p className="text-xs text-white/40 mt-1">
              Your preferences will persist across sessions on this device.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
