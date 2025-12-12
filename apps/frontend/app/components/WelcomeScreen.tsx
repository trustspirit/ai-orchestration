'use client';

import { OrchestratorIcon } from '@repo/ui';
import { Strings } from '@repo/shared';
import type { ProviderInfo } from '../lib/api';
import { ProviderIcon } from './ProviderIcons';

interface WelcomeScreenProps {
  providers: ProviderInfo[];
}

export function WelcomeScreen({ providers }: WelcomeScreenProps) {
  const availableProviders = providers.filter((p) => p.available);

  return (
    <div className="text-center max-w-lg">
      <div className="flex items-center justify-center mb-6">
        <OrchestratorIcon size="xl" />
      </div>
      <h3 className="text-xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">
        {Strings.app.name}
      </h3>
      <p className="text-[#86868b] text-sm mb-6 leading-relaxed">
        Configure your AI providers on the left panel. Each provider can have its own model and
        custom system prompt.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {availableProviders.map((p) => (
          <span
            key={p.name}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]"
            style={{ color: p.color }}
          >
            <ProviderIcon provider={p.name} className="w-3.5 h-3.5" />
            {p.displayName}
          </span>
        ))}
      </div>
    </div>
  );
}
