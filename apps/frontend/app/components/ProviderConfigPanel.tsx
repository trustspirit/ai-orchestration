'use client';

import { useState } from 'react';
import { Toggle, Select, Textarea, StatusDot } from '@repo/ui';
import { AI_PROVIDER_INFO, DEFAULT_PROVIDER_PROMPTS } from '@repo/shared';
import type { AiProviderName } from '@repo/shared';
import type { ProviderInfo, ProviderSetting } from '../lib/api';
import { ProviderIcon } from './ProviderIcons';

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
      <h3 className="text-xs font-normal text-[#86868b] uppercase tracking-wide mb-3">
        AI Providers
      </h3>

      {providers.map((providerInfo) => {
        const setting = getSetting(providerInfo.name);
        const info = AI_PROVIDER_INFO[providerInfo.name];
        const isExpanded = expandedProvider === providerInfo.name;
        const currentModel = setting.model || providerInfo.defaultModel;
        const modelInfo = providerInfo.models.find((m) => m.id === currentModel);

        return (
          <div
            key={providerInfo.name}
            className={`rounded-xl border border-[rgba(255,255,255,0.08)] overflow-visible transition-all duration-200 ${
              !providerInfo.available ? 'opacity-40' : ''
            } ${setting.enabled ? 'bg-[rgba(255,255,255,0.04)]' : 'bg-transparent'}`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors gap-2"
              onClick={() => setExpandedProvider(isExpanded ? null : providerInfo.name)}
            >
              {/* Left: Icon + Name + Model */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: `${info.color}15`, color: info.color }}
                >
                  <ProviderIcon provider={providerInfo.name} className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-white/90 text-sm">{info.displayName}</span>
                    {!providerInfo.available ? (
                      <span className="text-[10px] text-[#ff453a] font-medium flex-shrink-0">
                        Offline
                      </span>
                    ) : (
                      <StatusDot
                        status={setting.enabled ? 'active' : 'ready'}
                        size={setting.enabled ? 'md' : 'sm'}
                      />
                    )}
                  </div>
                  {providerInfo.available && setting.enabled && (
                    <span className="text-[10px] text-[#30d158] truncate">
                      {modelInfo?.name || currentModel}
                    </span>
                  )}
                  {providerInfo.available && !setting.enabled && (
                    <span className="text-[10px] text-white/40 truncate">Ready</span>
                  )}
                </div>
              </div>

              {/* Right: Toggle + Arrow */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div onClick={(e) => e.stopPropagation()}>
                  <Toggle
                    checked={setting.enabled}
                    onChange={(checked) => {
                      updateSetting(providerInfo.name, { enabled: checked });
                    }}
                    disabled={!providerInfo.available}
                    size="sm"
                  />
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-[#6e6e73] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Expanded Settings */}
            {isExpanded && providerInfo.available && (
              <div className="px-3 pb-3 space-y-3 border-t border-[rgba(255,255,255,0.08)] pt-3">
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
                  onChange={(e) =>
                    updateSetting(providerInfo.name, { systemPrompt: e.target.value })
                  }
                  rows={2}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
