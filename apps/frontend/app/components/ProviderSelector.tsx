'use client';

import { Chip } from '@repo/ui';
import { AI_PROVIDER_INFO, Strings } from '@repo/shared';
import type { AiProviderName } from '@repo/shared';

interface ProviderSelectorProps {
  availableProviders: AiProviderName[];
  selectedProviders: AiProviderName[];
  onToggleProvider: (provider: AiProviderName) => void;
}

export function ProviderSelector({
  availableProviders,
  selectedProviders,
  onToggleProvider,
}: ProviderSelectorProps) {
  const allProviders: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-400 ml-1">
        {Strings.chat.selectProviders}
      </label>
      <div className="flex flex-wrap gap-2">
        {allProviders.map((provider) => {
          const info = AI_PROVIDER_INFO[provider];
          const isAvailable = availableProviders.includes(provider);
          const isSelected = selectedProviders.includes(provider);

          return (
            <Chip
              key={provider}
              label={info.displayName}
              selected={isSelected}
              color={info.color}
              disabled={!isAvailable}
              onClick={() => isAvailable && onToggleProvider(provider)}
            />
          );
        })}
      </div>
      {availableProviders.length === 0 && (
        <p className="text-sm text-amber-400 mt-2">{Strings.chat.noProviders}</p>
      )}
    </div>
  );
}
