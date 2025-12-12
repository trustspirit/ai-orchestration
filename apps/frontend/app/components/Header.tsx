'use client';

import { Strings } from '@repo/shared';
import { OrchestratorIcon } from '@repo/ui';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/10">
      <div className="mx-auto max-w-[1200px] h-12 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <OrchestratorIcon size="md" className="group-hover:opacity-80 transition-opacity" />
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
