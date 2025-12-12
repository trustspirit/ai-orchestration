'use client';

import { Card, Badge } from '@repo/ui';
import type { ChatMessage as ChatMessageType } from '@repo/shared';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card
          variant={isUser ? 'default' : 'elevated'}
          padding="md"
          className={`
            ${isUser 
              ? 'bg-blue-600/30 border-blue-500/30' 
              : 'bg-white/8'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`
              w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
              ${isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}
            `}>
              {isUser ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isUser ? 'info' : 'success'} size="sm">
                  {isUser ? 'You' : 'AI Consensus'}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

