'use client';

import { useRef, useEffect } from 'react';
import type { ChatMessage as ChatMessageType } from '@repo/shared';
import type { ProviderInfo } from '../lib/api';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { WelcomeScreen } from './WelcomeScreen';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatAreaProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  error: string | null;
  providers: ProviderInfo[];
  enabledCount: number;
  onSendMessage: (message: string) => void;
}

export function ChatArea({
  messages,
  isLoading,
  error,
  providers,
  enabledCount,
  onSendMessage,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col min-w-0 py-6">
      {/* Chat Messages (Scrollable) */}
      <div
        className={`flex-1 ${messages.length > 0 ? 'overflow-y-auto pr-2' : 'flex items-center justify-center'}`}
      >
        {messages.length === 0 ? (
          <WelcomeScreen providers={providers} />
        ) : (
          messages.map((message) => <ChatMessage key={message.id} message={message} />)
        )}

        {/* Loading indicator */}
        {isLoading && <ThinkingIndicator />}

        {/* Error message */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20">
            <p className="text-[#ff453a] text-sm">{error}</p>
          </div>
        )}

        {/* Bottom spacer */}
        {messages.length > 0 && <div className="h-[30vh]" />}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input (Fixed at Bottom) */}
      <div className="flex-shrink-0 pt-4">
        <ChatInput onSend={onSendMessage} isLoading={isLoading} disabled={enabledCount === 0} />
        {enabledCount === 0 && (
          <p className="text-center text-[#ff9f0a] text-xs mt-3">
            Please enable at least one AI provider to start chatting
          </p>
        )}
      </div>
    </div>
  );
}

