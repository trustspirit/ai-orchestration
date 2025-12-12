'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Button, Spinner } from '@repo/ui';
import { Strings } from '@repo/shared';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-3 items-center p-4 rounded-2xl bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={Strings.chat.placeholder}
          disabled={isLoading || disabled}
          rows={1}
          className="
            flex-1 resize-none bg-transparent text-[#f5f5f7] placeholder-[#6e6e73]
            focus:outline-none text-base leading-relaxed
            min-h-[24px] max-h-[200px]
          "
        />
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            className="px-5 py-2"
          >
            {isLoading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <span>{Strings.chat.send}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
