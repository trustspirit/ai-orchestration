'use client';

import { useState } from 'react';
import { Card, Badge, Button } from '@repo/ui';
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
      <Button
        variant="secondary"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-sm"
      >
        <span>
          {Strings.chat.individualResponses} ({responses.length})
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
          {/* Consensus Summary */}
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-semibold text-white">{Strings.chat.consensus}</h4>
              {getAgreementBadge(consensus.agreementLevel)}
            </div>
            {consensus.keyPoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Key Points
                </p>
                <ul className="space-y-1">
                  {consensus.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                      <MarkdownRenderer content={point} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {consensus.differences.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Differences
                </p>
                <ul className="space-y-1">
                  {consensus.differences.map((diff, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                      <span className="text-amber-400 mt-1 flex-shrink-0">△</span>
                      <MarkdownRenderer content={diff} className="flex-1" />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Individual Responses */}
          {responses.map((response) => {
            const info = AI_PROVIDER_INFO[response.provider];
            const isResponseExpanded = expandedResponse === response.provider;

            return (
              <Card key={response.provider} variant="default" padding="md">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedResponse(isResponseExpanded ? null : response.provider)
                  }
                >
                  <div className="flex items-center gap-2">
                    <ProviderIcon
                      provider={response.provider}
                      className="w-5 h-5"
                      style={{ color: info.color }}
                    />
                    <span className="font-medium text-white">{info.displayName}</span>
                    <Badge variant="default" size="sm">
                      {response.model}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{response.latencyMs}ms</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isResponseExpanded ? 'rotate-180' : ''}`}
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

                {isResponseExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <MarkdownRenderer content={response.content} />
                    {response.usage && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex gap-4 text-xs text-gray-500">
                        <span>Prompt: {response.usage.promptTokens}</span>
                        <span>Completion: {response.usage.completionTokens}</span>
                        <span>Total: {response.usage.totalTokens}</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
