'use client';

import { useState } from 'react';
import { Card, Toggle, Select, Textarea, Badge } from '@repo/ui';
import { AI_PROVIDER_INFO, DEFAULT_PROVIDER_PROMPTS } from '@repo/shared';
import type { AiProviderName } from '@repo/shared';
import type { ProviderInfo, ProviderSetting } from '../lib/api';

interface ProviderConfigPanelProps {
  providers: ProviderInfo[];
  settings: ProviderSetting[];
  onSettingsChange: (settings: ProviderSetting[]) => void;
}

export function ProviderConfigPanel({
  providers,
  settings,
  onSettingsChange,
}: ProviderConfigPanelProps) {
  const [expandedProvider, setExpandedProvider] = useState<AiProviderName | null>(null);

  const getSetting = (provider: AiProviderName): ProviderSetting => {
    return (
      settings.find((s) => s.provider === provider) || {
        provider,
        enabled: false,
        model: undefined,
        systemPrompt: undefined,
      }
    );
  };

  const updateSetting = (provider: AiProviderName, updates: Partial<ProviderSetting>) => {
    const newSettings = settings.map((s) => (s.provider === provider ? { ...s, ...updates } : s));

    // 해당 프로바이더가 없으면 추가
    if (!settings.find((s) => s.provider === provider)) {
      newSettings.push({
        provider,
        enabled: false,
        model: undefined,
        systemPrompt: undefined,
        ...updates,
      });
    }

    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400 ml-1">AI Providers Configuration</h3>

      {providers.map((providerInfo) => {
        const setting = getSetting(providerInfo.name);
        const info = AI_PROVIDER_INFO[providerInfo.name];
        const isExpanded = expandedProvider === providerInfo.name;

        return (
          <Card
            key={providerInfo.name}
            variant="default"
            padding="none"
            className={`overflow-hidden transition-all duration-300 ${
              !providerInfo.available ? 'opacity-50' : ''
            }`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpandedProvider(isExpanded ? null : providerInfo.name)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${info.color}20` }}
                >
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: info.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{info.displayName}</span>
                    {!providerInfo.available && (
                      <Badge variant="warning" size="sm">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {setting.model || providerInfo.defaultModel || 'No model selected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Toggle
                  checked={setting.enabled}
                  onChange={(checked) => updateSetting(providerInfo.name, { enabled: checked })}
                  disabled={!providerInfo.available}
                />
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Expanded Settings */}
            {isExpanded && providerInfo.available && (
              <div className="px-4 pb-4 space-y-4 border-t border-white/10 pt-4">
                {/* Model Selection */}
                <Select
                  label="Model"
                  options={providerInfo.models.map((m) => ({
                    value: m.id,
                    label: m.name,
                    description: m.description,
                  }))}
                  value={setting.model || providerInfo.defaultModel}
                  onChange={(value) => updateSetting(providerInfo.name, { model: value })}
                />

                {/* System Prompt */}
                <Textarea
                  label="Custom System Prompt (Optional)"
                  placeholder={DEFAULT_PROVIDER_PROMPTS[providerInfo.name]}
                  value={setting.systemPrompt || ''}
                  onChange={(e) =>
                    updateSetting(providerInfo.name, { systemPrompt: e.target.value })
                  }
                  rows={3}
                />

                <p className="text-xs text-gray-500">
                  Leave empty to use global role or default prompt
                </p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
