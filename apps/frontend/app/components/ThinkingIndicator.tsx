'use client';

import { Avatar, OrchestratorIcon } from '@repo/ui';

export function ThinkingIndicator() {
  return (
    <div className="py-6 border-b border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-3 mb-3">
        <Avatar variant="ai" size="md">
          <OrchestratorIcon size="sm" animated />
        </Avatar>
        <div className="flex-1">
          <span className="text-sm font-medium text-[#f5f5f7]">AI Orchestrator</span>
        </div>
      </div>
      <div className="pl-11">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-[#0071e3] rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-[#30d158] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2 h-2 bg-[#bf5af2] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
            <span
              className="w-2 h-2 bg-[#ff9f0a] rounded-full animate-bounce"
              style={{ animationDelay: '450ms' }}
            />
          </div>
          <span className="text-sm text-[#86868b]">AI models are thinking...</span>
        </div>
      </div>
    </div>
  );
}

