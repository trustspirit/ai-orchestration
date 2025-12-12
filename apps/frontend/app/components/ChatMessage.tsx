'use client';

import type { ChatMessage as ChatMessageType } from '@repo/shared';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ResponseDetails } from './ResponseDetails';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className="py-6 border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isUser
              ? 'bg-[#0071e3]'
              : 'bg-gradient-to-br from-[#0071e3] to-[#bf5af2]'
          }`}
        >
          {isUser ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
              <path d="M12 12L6 6M12 12L18 6M12 12L6 18M12 12L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          )}
        </div>
        {/* Name and time */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#f5f5f7]">
              {isUser ? 'You' : 'AI Orchestrator'}
            </span>
            <span className="text-xs text-[#6e6e73]">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pl-11">
        {isUser ? (
          <p className="text-[#f5f5f7] whitespace-pre-wrap leading-relaxed text-[15px]">
            {message.content}
          </p>
        ) : (
          <>
            <MarkdownRenderer content={message.content} />
            {/* Individual Responses - shown below the consensus for assistant messages */}
            {message.responses && message.consensus && (
              <ResponseDetails 
                consensus={message.consensus} 
                responses={message.responses} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
