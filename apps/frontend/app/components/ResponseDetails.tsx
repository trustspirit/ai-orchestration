'use client';

import { useState } from 'react';
import { Badge, Button } from '@repo/ui';
import { AI_PROVIDER_INFO, Strings } from '@repo/shared';
import type { ProviderResponse, ConsensusResult } from '@repo/shared';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ProviderIcon } from './ProviderIcons';

interface ResponseDetailsProps {
  consensus: ConsensusResult | null;
  responses: ProviderResponse[] | null;
}

export function ResponseDetails({ consensus, responses }: ResponseDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);

  if (!consensus || !responses || responses.length === 0) {
    return null;
  }

  const getAgreementBadge = (level: ConsensusResult['agreementLevel']) => {
    const variants = {
      high: 'success' as const,
      medium: 'warning' as const,
      low: 'error' as const,
    };
    return (
      <Badge variant={variants[level]} size="sm">
        {Strings.chat.agreementLevel[level]}
      </Badge>
    );
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] hover:bg-[#2d2d2d] transition-colors"
      >
        <span className="text-[#f5f5f7]">
          {Strings.chat.individualResponses} ({responses.length})
        </span>
        <svg
          className={`w-4 h-4 text-[#86868b] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Consensus Summary */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.12)] bg-[#1d1d1f] p-5">
            <div className="flex items-center gap-2 mb-4">
              <h4 className="text-sm font-medium text-[#f5f5f7]">{Strings.chat.consensus}</h4>
              {getAgreementBadge(consensus.agreementLevel)}
            </div>

            {/* Summary */}
            {consensus.summary && (
              <div className="mb-4 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <p className="text-xs font-normal text-[#86868b] uppercase tracking-wide mb-2">
                  Summary
                </p>
                <div className="text-sm text-[#f5f5f7]">
                  <MarkdownRenderer content={consensus.summary} />
                </div>
              </div>
            )}

            {consensus.keyPoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-normal text-[#86868b] uppercase tracking-wide">
                  Key Points
                </p>
                <ul className="space-y-1.5">
                  {consensus.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-[#f5f5f7] flex items-start gap-2">
                      <span className="text-[#0071e3] mt-1 flex-shrink-0">•</span>
                      <MarkdownRenderer content={point} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {consensus.differences.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-normal text-[#86868b] uppercase tracking-wide">
                  Differences
                </p>
                <ul className="space-y-1.5">
                  {consensus.differences.map((diff, idx) => (
                    <li key={idx} className="text-sm text-[#86868b] flex items-start gap-2">
                      <span className="text-[#ff9f0a] mt-1 flex-shrink-0">△</span>
                      <MarkdownRenderer content={diff} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Individual Responses */}
          {responses.map((response) => {
            const info = AI_PROVIDER_INFO[response.provider];
            const isResponseExpanded = expandedResponse === response.provider;

            return (
              <div
                key={response.provider}
                className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1d1d1f] overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                  onClick={() => setExpandedResponse(isResponseExpanded ? null : response.provider)}
                >
                  <div className="flex items-center gap-2.5">
                    <ProviderIcon
                      provider={response.provider}
                      className="w-5 h-5"
                      style={{ color: info.color }}
                    />
                    <span className="font-medium text-[#f5f5f7] text-sm">{info.displayName}</span>
                    <Badge variant="default" size="sm">
                      {response.model}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#6e6e73]">{response.latencyMs}ms</span>
                    <svg
                      className={`w-4 h-4 text-[#6e6e73] transition-transform ${isResponseExpanded ? 'rotate-180' : ''}`}
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

                {isResponseExpanded && (
                  <div className="px-4 pb-4 border-t border-[rgba(255,255,255,0.08)] pt-3">
                    <MarkdownRenderer
                      content={response.content}
                      externalCitations={response.citations}
                    />
                    {response.usage && (
                      <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.05)] flex gap-4 text-xs text-[#6e6e73]">
                        <span>Prompt: {response.usage.promptTokens}</span>
                        <span>Completion: {response.usage.completionTokens}</span>
                        <span>Total: {response.usage.totalTokens}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
