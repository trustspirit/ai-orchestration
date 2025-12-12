'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  autoResize?: boolean;
  maxHeight?: number;
  size?: 'sm' | 'md';
}

export const Textarea = ({
  label,
  autoResize = false,
  maxHeight = 300,
  size = 'md',
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

  const sizeStyles = {
    sm: {
      label: 'text-[11px]',
      textarea: 'px-3 py-2 text-xs',
      gap: 'gap-1',
    },
    md: {
      label: 'text-sm',
      textarea: 'px-4 py-3 text-sm',
      gap: 'gap-2',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={`flex flex-col ${styles.gap}`}>
      {label && <label className={`${styles.label} font-normal text-white/50`}>{label}</label>}
      <textarea
        ref={textareaRef}
        className={`
          ${styles.textarea} rounded-lg
          bg-white/10 backdrop-blur-xl border border-white/15
          text-white placeholder-white/30
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30
          transition-all duration-200
          resize-none
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
};
