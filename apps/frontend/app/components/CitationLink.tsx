'use client';

import { useState, useRef, useEffect } from 'react';

export interface Citation {
  number: number;
  url: string;
  title?: string;
}

interface CitationLinkProps {
  number: number;
  url?: string;
  title?: string;
}

export function CitationLink({ number, url, title }: CitationLinkProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState<'above' | 'below'>('above');
  const linkRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (showPreview && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      setPreviewPosition(spaceAbove > 120 ? 'above' : 'below');
    }
  }, [showPreview]);

  let displayUrl = 'Source';
  try {
    if (url) {
      displayUrl = new URL(url).hostname.replace('www.', '');
    }
  } catch {
    displayUrl = url || 'Source';
  }
  const displayTitle = title || displayUrl;

  const baseClasses =
    'inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 text-[11px] font-semibold rounded-md transition-all duration-150 align-middle mx-0.5 no-underline';

  return (
    <span
      ref={linkRef}
      className="relative inline-block"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${baseClasses} bg-[#5ac8fa]/20 text-[#5ac8fa] hover:bg-[#5ac8fa]/40 hover:scale-110 cursor-pointer shadow-sm`}
          onClick={(e) => e.stopPropagation()}
        >
          {number}
        </a>
      ) : (
        <span
          className={`${baseClasses} bg-white/10 text-white/40 cursor-default`}
          title="Source link not available"
        >
          {number}
        </span>
      )}

      {/* Preview tooltip */}
      {showPreview && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-[100] w-72 p-3 rounded-xl bg-[#1d1d1f]/95 border border-white/20 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 ${
            previewPosition === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ pointerEvents: url ? 'auto' : 'none' }}
        >
          {url ? (
            <>
              <div className="flex items-start gap-2.5">
                {/* Favicon */}
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${displayUrl}&sz=32`}
                    alt=""
                    className="w-5 h-5"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{displayTitle}</p>
                  <p className="text-xs text-white/50 truncate mt-0.5">{displayUrl}</p>
                </div>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex items-center gap-1.5 text-xs text-[#5ac8fa] hover:text-[#70d7ff] transition-colors"
              >
                <span className="truncate">{url}</span>
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-white/60">Source [{number}]</p>
              <p className="text-xs text-white/40 mt-1">Link not available</p>
            </div>
          )}

          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1d1d1f]/95 rotate-45 ${
              previewPosition === 'above'
                ? 'bottom-[-6px] border-r border-b border-white/20'
                : 'top-[-6px] border-l border-t border-white/20'
            }`}
          />
        </div>
      )}
    </span>
  );
}

// Parse content and extract citations
export function extractCitations(content: string): {
  processedContent: string;
  citations: Citation[];
} {
  const citations: Citation[] = [];
  const urlMap: Record<number, { url: string; title?: string }> = {};

  // Pattern 1: Markdown reference style [1]: https://...
  const markdownRefPattern = /\[(\d+)\]:\s*(https?:\/\/[^\s\n]+)/g;
  let match;
  while ((match = markdownRefPattern.exec(content)) !== null) {
    urlMap[parseInt(match[1], 10)] = { url: match[2].trim() };
  }

  // Pattern 2: Sources/References section with various formats
  const sourcesSectionPatterns = [
    // "Sources:" or "References:" followed by numbered list
    /(?:Sources?|References?|Citations?):\s*\n?((?:[-•*]?\s*\[?\d+\]?\.?\s*https?:\/\/[^\n]+\n?)+)/gi,
    // Just URLs at the end with numbers
    /\n\n((?:\d+\.\s*https?:\/\/[^\n]+\n?)+)$/gi,
  ];

  sourcesSectionPatterns.forEach((pattern) => {
    const sectionMatch = pattern.exec(content);
    if (sectionMatch) {
      const lines = sectionMatch[1].split('\n');
      lines.forEach((line) => {
        // Match various formats: [1] url, 1. url, 1) url, • [1] url
        const lineMatch = line.match(
          /[-•*]?\s*\[?(\d+)\]?[.):]*\s*(https?:\/\/[^\s]+)(?:\s*[-–—]\s*(.+))?/,
        );
        if (lineMatch) {
          urlMap[parseInt(lineMatch[1], 10)] = {
            url: lineMatch[2].trim(),
            title: lineMatch[3]?.trim(),
          };
        }
      });
    }
  });

  // Pattern 3: Inline with parentheses [1](https://...)
  const inlineParenPattern = /\[(\d+)\]\s*\((https?:\/\/[^)]+)\)/g;
  while ((match = inlineParenPattern.exec(content)) !== null) {
    urlMap[parseInt(match[1], 10)] = { url: match[2].trim() };
  }

  // Pattern 4: Direct URL after citation [1] https://...
  const directUrlPattern = /\[(\d+)\]\s+(https?:\/\/[^\s\n]+)/g;
  while ((match = directUrlPattern.exec(content)) !== null) {
    if (!urlMap[parseInt(match[1], 10)]) {
      urlMap[parseInt(match[1], 10)] = { url: match[2].trim() };
    }
  }

  // Pattern 5: Perplexity-style numbered sources at end
  // 1. https://example.com - Title
  const numberedSourcePattern = /^(\d+)\.\s*(https?:\/\/[^\s]+)(?:\s*[-–—]\s*(.+))?$/gm;
  while ((match = numberedSourcePattern.exec(content)) !== null) {
    urlMap[parseInt(match[1], 10)] = {
      url: match[2].trim(),
      title: match[3]?.trim(),
    };
  }

  // Find all citation numbers used in text [1], [2], etc.
  const citationRefs = content.match(/\[(\d+)\]/g) || [];
  const numsSet = new Set(citationRefs.map((ref) => parseInt(ref.replace(/[[\]]/g, ''), 10)));
  const uniqueNums = Array.from(numsSet);

  uniqueNums
    .sort((a, b) => a - b)
    .forEach((num) => {
      const info = urlMap[num];
      citations.push({
        number: num,
        url: info?.url || '',
        title: info?.title,
      });
    });

  // Remove source sections from content for cleaner display
  let processedContent = content
    // Remove markdown reference definitions
    .replace(/\[(\d+)\]:\s*https?:\/\/[^\n]+\n?/g, '')
    // Remove Sources/References sections
    .replace(
      /(?:Sources?|References?|Citations?):\s*\n?((?:[-•*]?\s*\[?\d+\]?\.?\s*https?:\/\/[^\n]+\n?)+)/gi,
      '',
    )
    // Remove trailing numbered source lists
    .replace(/\n\n(?:\d+\.\s*https?:\/\/[^\n]+\n?)+$/g, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { processedContent, citations };
}

// Process text to replace [n] with CitationLink components
export function processCitationsInText(
  text: string,
  citations: Citation[],
): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  const citationPattern = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = citationPattern.exec(text)) !== null) {
    // Add text before citation
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const num = parseInt(match[1], 10);
    const citation = citations.find((c) => c.number === num);

    parts.push(
      <CitationLink
        key={`citation-${num}-${match.index}`}
        number={num}
        url={citation?.url}
        title={citation?.title}
      />,
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
