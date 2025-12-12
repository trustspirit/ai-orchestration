'use client';

import { useState } from 'react';
import { Toggle, Select, Textarea, StatusDot } from '@repo/ui';
import { AI_PROVIDER_INFO, DEFAULT_PROVIDER_PROMPTS } from '@repo/shared';
import type { AiProviderName } from '@repo/shared';
import type { ProviderInfo, ProviderSetting } from '../lib/api';
import { ProviderIcon } from './ProviderIcons';
import { roleOptionsWithInherit } from './RoleSelector';

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
        role: undefined,
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
        role: undefined,
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
        const hasCustomRole = setting.role && setting.role !== '';

        return (
          <div
            key={providerInfo.name}
            className={`rounded-xl border overflow-visible transition-all duration-200 ${
              !providerInfo.available
                ? 'opacity-40 border-white/5'
                : isExpanded
                  ? 'border-white/20 bg-white/5'
                  : 'border-white/10 hover:border-white/15'
            } ${setting.enabled && !isExpanded ? 'bg-white/[0.03]' : ''}`}
          >
            {/* Header - Main row */}
            <div className="flex items-center gap-2.5 px-3 py-2.5">
              {/* Icon */}
              <div
                className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: `${info.color}15`, color: info.color }}
              >
                <ProviderIcon provider={providerInfo.name} className="w-4.5 h-4.5" />
              </div>

              {/* Name + Status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-white/90 text-sm">{info.displayName}</span>
                  {!providerInfo.available ? (
                    <span className="text-[10px] text-[#ff453a] font-medium">Offline</span>
                  ) : (
                    <StatusDot
                      status={setting.enabled ? 'active' : 'ready'}
                      size={setting.enabled ? 'md' : 'sm'}
                    />
                  )}
                </div>
                {providerInfo.available && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] truncate ${setting.enabled ? 'text-[#30d158]' : 'text-white/40'}`}
                    >
                      {setting.enabled ? modelInfo?.name || currentModel : 'Ready'}
                    </span>
                    {hasCustomRole && setting.enabled && (
                      <>
                        <span className="text-[10px] text-white/20">•</span>
                        <span className="text-[10px] text-white/50 capitalize">{setting.role}</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Toggle */}
              <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                <Toggle
                  checked={setting.enabled}
                  onChange={(checked) => {
                    updateSetting(providerInfo.name, { enabled: checked });
                  }}
                  disabled={!providerInfo.available}
                  size="sm"
                />
              </div>
            </div>

            {/* Configure button - always visible when available */}
            {providerInfo.available && (
              <button
                onClick={() => setExpandedProvider(isExpanded ? null : providerInfo.name)}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] transition-all border-t ${
                  isExpanded
                    ? 'text-white/70 border-white/10 bg-white/5'
                    : 'text-white/40 border-white/5 hover:text-white/60 hover:bg-white/[0.02]'
                }`}
              >
                <span>{isExpanded ? 'Hide settings' : 'Configure'}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
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
              </button>
            )}

            {/* Expanded Settings */}
            {isExpanded && providerInfo.available && (
              <div className="px-3 pb-3 space-y-2.5 border-t border-white/10 pt-3">
                {/* Model Selection */}
                <Select
                  label="Model"
                  size="sm"
                  options={providerInfo.models.map((m) => ({
                    value: m.id,
                    label: m.name,
                    description: m.description,
                  }))}
                  value={setting.model || providerInfo.defaultModel}
                  onChange={(value) => updateSetting(providerInfo.name, { model: value })}
                />

                {/* Individual Role */}
                <Select
                  label="Role"
                  size="sm"
                  options={roleOptionsWithInherit}
                  value={setting.role || ''}
                  onChange={(value) =>
                    updateSetting(providerInfo.name, { role: value || undefined })
                  }
                />

                {/* System Prompt */}
                <Textarea
                  label="Custom Prompt"
                  size="sm"
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
