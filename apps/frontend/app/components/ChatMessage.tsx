'use client';

import type { ChatMessage as ChatMessageType } from '@repo/shared';
import { Avatar } from '@repo/ui';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ResponseDetails } from './ResponseDetails';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className="py-6 border-b border-white/5 last:border-b-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar variant={isUser ? 'user' : 'ai'} size="md" />
        {/* Name and time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/90">
              {isUser ? 'You' : 'AI Orchestrator'}
            </span>
            <span className="text-xs text-white/40">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pl-11">
        {isUser ? (
          <p className="text-white/90 whitespace-pre-wrap leading-relaxed text-[15px]">
            {message.content}
          </p>
        ) : (
          <>
            <MarkdownRenderer content={message.content} />
            {/* Individual Responses - shown below the consensus for assistant messages */}
            {message.responses && message.consensus && (
              <ResponseDetails consensus={message.consensus} responses={message.responses} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
