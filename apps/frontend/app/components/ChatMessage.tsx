'use client';

import { Card, Badge } from '@repo/ui';
import type { ChatMessage as ChatMessageType } from '@repo/shared';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        <Card
          variant={isUser ? 'default' : 'elevated'}
          padding="md"
          className={`
            ${isUser ? 'bg-blue-600/30 border-blue-500/30' : 'bg-white/8'}
          `}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={isUser ? 'info' : 'success'} size="sm">
              {isUser ? 'You' : 'AI Consensus'}
            </Badge>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {isUser ? (
            <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
              {message.content}
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </Card>
      </div>
    </div>
  );
}
