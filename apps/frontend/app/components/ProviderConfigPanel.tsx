'use client';

import { useState } from 'react';
import { Card, Toggle, Select, Textarea } from '@repo/ui';
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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 ml-1">AI Providers</h3>

      {providers.map((providerInfo) => {
        const setting = getSetting(providerInfo.name);
        const info = AI_PROVIDER_INFO[providerInfo.name];
        const isExpanded = expandedProvider === providerInfo.name;

        return (
          <Card
            key={providerInfo.name}
            variant="default"
            padding="none"
            className={`overflow-visible transition-all duration-300 ${
              !providerInfo.available ? 'opacity-50' : ''
            }`}
          >
            {/* Header - Compact Layout */}
            <div
              className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors gap-2"
              onClick={() => setExpandedProvider(isExpanded ? null : providerInfo.name)}
            >
              {/* Left: Icon + Name + Status */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div
                  className="w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${info.color}20` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                </div>
                <span className="font-medium text-white text-sm truncate">
                  {info.displayName}
                </span>
                {providerInfo.available ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-heartbeat flex-shrink-0" />
                ) : (
                  <span className="text-[10px] text-yellow-500/80 font-medium flex-shrink-0">
                    N/A
                  </span>
                )}
              </div>

              {/* Right: Toggle + Arrow */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Toggle
                  checked={setting.enabled}
                  onChange={(checked) => {
                    updateSetting(providerInfo.name, { enabled: checked });
                  }}
                  disabled={!providerInfo.available}
                  size="sm"
                />
                <svg
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
              <div className="px-3 pb-3 space-y-3 border-t border-white/10 pt-3">
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
                  label="Custom Prompt"
                  placeholder={DEFAULT_PROVIDER_PROMPTS[providerInfo.name]}
                  value={setting.systemPrompt || ''}
                  onChange={(e) => updateSetting(providerInfo.name, { systemPrompt: e.target.value })}
                  rows={2}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
