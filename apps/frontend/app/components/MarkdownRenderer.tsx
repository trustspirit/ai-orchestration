'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-xl font-bold text-white mt-4 mb-2 first:mt-0">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-white mt-3 mb-2 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-semibold text-white mt-2 mb-1 first:mt-0">{children}</h3>
        ),

        // Paragraph
        p: ({ children }) => <p className="text-gray-200 mb-3 last:mb-0 leading-relaxed">{children}</p>,

        // Lists
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-gray-200">{children}</li>,

        // Code
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-white/10 rounded text-blue-300 text-sm font-mono">
                {children}
              </code>
            );
          }
          return (
            <code
              className={`block p-3 bg-black/40 rounded-lg overflow-x-auto text-sm font-mono text-gray-200 ${className || ''}`}
              {...props}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-3 overflow-hidden rounded-lg">{children}</pre>
        ),

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-500/50 pl-4 py-1 my-3 bg-blue-500/5 rounded-r-lg italic text-gray-300">
            {children}
          </blockquote>
        ),

        // Links
        a: ({ children, href }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        ),

        // Table
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full border border-white/10 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
        tbody: ({ children }) => <tbody className="divide-y divide-white/10">{children}</tbody>,
        tr: ({ children }) => <tr className="divide-x divide-white/10">{children}</tr>,
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-sm font-semibold text-white">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-sm text-gray-300">{children}</td>
        ),

        // Horizontal rule
        hr: () => <hr className="my-4 border-white/10" />,

        // Strong and emphasis
        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-300">{children}</em>,

        // Strikethrough
        del: ({ children }) => <del className="text-gray-500 line-through">{children}</del>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

