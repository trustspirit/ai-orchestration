'use client';

import { useState, useCallback } from 'react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  // Extract language from className (e.g., "language-javascript")
  const language = className?.replace('language-', '') || '';

  return (
    <div className="relative group">
      {/* Header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[rgba(255,255,255,0.08)] rounded-t-xl">
        <span className="text-xs text-[#86868b] font-mono uppercase">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#86868b] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.08)] rounded transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-[#30d158]" />
              <span className="text-[#30d158]">Copied</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code content */}
      <code className="block p-4 bg-[#1d1d1f] rounded-b-xl overflow-x-auto text-sm font-mono text-[#f5f5f7] leading-relaxed">
        {children}
      </code>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

