'use client';

import { Strings } from '@repo/shared';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
      <div className="mx-auto max-w-[1200px] h-12 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          {/* Minimal Orchestration Icon */}
          <div className="w-7 h-7 relative">
            <svg
              className="w-7 h-7 text-white group-hover:text-white/80 transition-colors"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring */}
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              {/* Connecting lines */}
              <path
                d="M14 14L7 7M14 14L21 7M14 14L7 21M14 14L21 21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />
              {/* Corner nodes */}
              <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.6" />
              <circle cx="21" cy="7" r="2" fill="currentColor" opacity="0.6" />
              <circle cx="7" cy="21" r="2" fill="currentColor" opacity="0.6" />
              <circle cx="21" cy="21" r="2" fill="currentColor" opacity="0.6" />
              {/* Center hub */}
              <circle cx="14" cy="14" r="4" fill="currentColor" />
              <circle cx="14" cy="14" r="2" fill="black" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white/90 tracking-tight group-hover:text-white transition-colors">
            {Strings.app.name}
          </span>
        </a>
        <nav className="flex items-center gap-8">
          <a
            href="/"
            className="text-xs font-normal text-white/90 hover:text-white transition-colors"
          >
            {Strings.nav.chat}
          </a>
          <a
            href="/settings"
            className="text-xs font-normal text-white/50 hover:text-white/90 transition-colors"
          >
            {Strings.nav.settings}
          </a>
        </nav>
      </div>
    </header>
  );
}
