'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  autoResize?: boolean;
  maxHeight?: number;
}

export const Textarea = ({
  label,
  autoResize = false,
  maxHeight = 300,
  className,
  ...props
}: TextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [props.value, autoResize, maxHeight]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-normal text-[#86868b] ml-1">{label}</label>
      )}
      <textarea
        ref={textareaRef}
        className={`
          px-4 py-3 rounded-xl
          bg-[#1d1d1f] border border-[rgba(255,255,255,0.12)]
          text-[#f5f5f7] placeholder-[#6e6e73]
          focus:outline-none focus:ring-2 focus:ring-[rgba(0,113,227,0.5)] focus:border-[#0071e3]
          transition-all duration-200
          resize-none
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
};
