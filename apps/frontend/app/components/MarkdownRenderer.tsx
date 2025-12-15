'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { extractCitations, processCitationsInText, CitationLink } from './CitationLink';
import type { Citation } from './CitationLink';

interface ExternalCitation {
  index: number;
  url: string;
  title?: string;
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
  externalCitations?: ExternalCitation[]; // Citations from API (e.g., Perplexity)
}

export function MarkdownRenderer({ content, className, externalCitations }: MarkdownRendererProps) {
  // Extract and process citations
  const { processedContent, citations } = useMemo(() => {
    const extracted = extractCitations(content);

    // Merge with external citations (from API like Perplexity)
    if (externalCitations && externalCitations.length > 0) {
      externalCitations.forEach((extCitation) => {
        const citationNum = extCitation.index;
        const existing = extracted.citations.find((c) => c.number === citationNum);
        if (existing) {
          // Update existing citation with API data
          if (!existing.url) existing.url = extCitation.url;
          if (!existing.title && extCitation.title) existing.title = extCitation.title;
        } else {
          // Add new citation from API
          extracted.citations.push({
            number: citationNum,
            url: extCitation.url,
            title: extCitation.title,
          });
        }
      });
      // Sort by number
      extracted.citations.sort((a, b) => a.number - b.number);
    }

    return extracted;
  }, [content, externalCitations]);

  // Helper to process text nodes for citations
  const processTextWithCitations = (text: string) => {
    if (citations.length === 0) return text;
    return processCitationsInText(text, citations);
  };

  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-semibold text-[#f5f5f7] mt-4 mb-2 first:mt-0 tracking-tight">
              {processChildren(children, processTextWithCitations)}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-medium text-[#f5f5f7] mt-3 mb-2 first:mt-0 tracking-tight">
              {processChildren(children, processTextWithCitations)}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium text-[#f5f5f7] mt-2 mb-1 first:mt-0">
              {processChildren(children, processTextWithCitations)}
            </h3>
          ),

          // Paragraph - process citations in text
          p: ({ children }) => (
            <p className="text-[#f5f5f7] mb-3 last:mb-0 leading-relaxed text-[15px]">
              {processChildren(children, processTextWithCitations)}
            </p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[#f5f5f7] text-[15px]">
              {processChildren(children, processTextWithCitations)}
            </li>
          ),

          // Code - inline and block
          code: ({ className, children }) => {
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
              {processChildren(children, processTextWithCitations)}
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
              <ExternalLinkIcon />
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
            <th className="px-3 py-2 text-left text-sm font-medium text-[#f5f5f7]">
              {processChildren(children, processTextWithCitations)}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm text-[#86868b]">
              {processChildren(children, processTextWithCitations)}
            </td>
          ),

          // Horizontal rule
          hr: () => <hr className="my-4 border-[rgba(255,255,255,0.08)]" />,

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-medium text-[#f5f5f7]">
              {processChildren(children, processTextWithCitations)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#86868b]">
              {processChildren(children, processTextWithCitations)}
            </em>
          ),

          // Strikethrough
          del: ({ children }) => <del className="text-[#6e6e73] line-through">{children}</del>,
        }}
      >
        {processedContent}
      </ReactMarkdown>

      {/* Citation sources footer */}
      {citations.length > 0 && <CitationFooter citations={citations} />}
    </div>
  );
}

// Process children to handle citations in text nodes
function processChildren(
  children: React.ReactNode,
  processor: (text: string) => React.ReactNode,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return processor(child);
    }
    return child;
  });
}

// Citation footer component
function CitationFooter({ citations }: { citations: Citation[] }) {
  const validCitations = citations.filter((c) => c.url);

  if (validCitations.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-white/10">
      <p className="text-xs font-medium text-white/50 mb-2">Sources</p>
      <div className="flex flex-wrap gap-2">
        {validCitations.map((citation) => {
          const hostname = new URL(citation.url).hostname.replace('www.', '');
          return (
            <a
              key={citation.number}
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
            >
              <span className="text-[10px] font-medium text-[#5ac8fa]">[{citation.number}]</span>
              <img
                src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`}
                alt=""
                className="w-3 h-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xs text-white/60 group-hover:text-white/80 truncate max-w-[120px]">
                {hostname}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Icon component
function ExternalLinkIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
