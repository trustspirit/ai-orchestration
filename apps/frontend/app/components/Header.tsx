'use client';

import { Strings } from '@repo/shared';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{Strings.app.name}</h1>
              <p className="text-xs text-gray-400">{Strings.app.tagline}</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {Strings.nav.chat}
            </a>
            <a href="/settings" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {Strings.nav.settings}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

