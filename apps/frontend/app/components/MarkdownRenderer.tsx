'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
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
        <span className="text-xs text-[#86868b] font-mono uppercase">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#86868b] hover:text-[#f5f5f7] hover:bg-[rgba(255,255,255,0.08)] rounded transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-[#30d158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[#30d158]">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
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

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold text-[#f5f5f7] mt-4 mb-2 first:mt-0 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-medium text-[#f5f5f7] mt-3 mb-2 first:mt-0 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-[#f5f5f7] mt-2 mb-1 first:mt-0">
              {children}
            </h3>
          ),

          // Paragraph
          p: ({ children }) => (
            <p className="text-[#f5f5f7] mb-3 last:mb-0 leading-relaxed text-[15px]">{children}</p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="text-[#f5f5f7] text-[15px]">{children}</li>,

          // Code - inline and block
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] rounded text-[#ff9f0a] text-sm font-mono">
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },
          pre: ({ children }) => (
            <div className="mb-3 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)]">
              {children}
            </div>
          ),

          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0071e3] pl-4 py-1 my-3 bg-[rgba(0,113,227,0.08)] rounded-r-xl text-[#86868b]">
              {children}
            </blockquote>
          ),

          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#5ac8fa] hover:text-[#70d7ff] underline underline-offset-2 transition-colors"
            >
              {children}
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ),

          // Table
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[rgba(255,255,255,0.04)]">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[rgba(255,255,255,0.08)]">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="divide-x divide-[rgba(255,255,255,0.08)]">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-sm font-medium text-[#f5f5f7]">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm text-[#86868b]">{children}</td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-4 border-[rgba(255,255,255,0.08)]" />,

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-medium text-[#f5f5f7]">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-[#86868b]">{children}</em>,

          // Strikethrough
          del: ({ children }) => (
            <del className="text-[#6e6e73] line-through">{children}</del>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
