'use client';

import { Strings } from '@repo/shared';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 apple-glass border-b border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto max-w-[1200px] h-12 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          {/* Orchestration Icon - Central hub with connected nodes */}
          <div className="relative w-7 h-7">
            <svg
              className="w-7 h-7"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Connecting lines */}
              <path
                d="M14 14L6 6M14 14L22 6M14 14L6 22M14 14L22 22"
                stroke="url(#orchestratorGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Outer nodes */}
              <circle cx="6" cy="6" r="2.5" fill="#0071e3" />
              <circle cx="22" cy="6" r="2.5" fill="#30d158" />
              <circle cx="6" cy="22" r="2.5" fill="#ff9f0a" />
              <circle cx="22" cy="22" r="2.5" fill="#bf5af2" />
              {/* Center hub */}
              <circle cx="14" cy="14" r="4" fill="url(#centerGradient)" />
              <circle cx="14" cy="14" r="2.5" fill="#f5f5f7" />
              {/* Gradients */}
              <defs>
                <linearGradient id="orchestratorGradient" x1="6" y1="6" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0071e3" />
                  <stop offset="0.5" stopColor="#bf5af2" />
                  <stop offset="1" stopColor="#30d158" />
                </linearGradient>
                <linearGradient id="centerGradient" x1="10" y1="10" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0071e3" />
                  <stop offset="1" stopColor="#bf5af2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-sm font-medium text-[#f5f5f7] tracking-tight group-hover:text-[#0071e3] transition-colors">
            {Strings.app.name}
          </span>
        </a>
        <nav className="flex items-center gap-8">
          <a
            href="/"
            className="text-xs font-normal text-[#f5f5f7] hover:text-[#0071e3] transition-colors"
          >
            {Strings.nav.chat}
          </a>
          <a
            href="/settings"
            className="text-xs font-normal text-[#86868b] hover:text-[#f5f5f7] transition-colors"
          >
            {Strings.nav.settings}
          </a>
        </nav>
      </div>
    </header>
  );
}
