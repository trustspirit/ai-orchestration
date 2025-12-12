'use client';

import { StatusDot } from '@repo/ui';
import { AI_PROVIDER_INFO } from '@repo/shared';
import type { ProviderInfo, ProviderSetting } from '../lib/api';
import { ProviderConfigPanel } from './ProviderConfigPanel';
import { RoleSelector } from './RoleSelector';
import { ProviderIcon } from './ProviderIcons';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  providers: ProviderInfo[];
  providerSettings: ProviderSetting[];
  globalRole: string;
  enabledCount: number;
  hasError?: boolean;
  onSettingsChange: (settings: ProviderSetting[]) => void;
  onRoleChange: (role: string) => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  providers,
  providerSettings,
  globalRole,
  enabledCount,
  hasError,
  onSettingsChange,
  onRoleChange,
}: SidebarProps) {
  if (isOpen) {
    return (
      <ExpandedSidebar
        onCollapse={onToggle}
        providers={providers}
        providerSettings={providerSettings}
        globalRole={globalRole}
        enabledCount={enabledCount}
        hasError={hasError}
        onSettingsChange={onSettingsChange}
        onRoleChange={onRoleChange}
      />
    );
  }

  return (
    <CollapsedSidebar onExpand={onToggle} providers={providers} providerSettings={providerSettings} />
  );
}

// Expanded Sidebar
interface ExpandedSidebarProps {
  onCollapse: () => void;
  providers: ProviderInfo[];
  providerSettings: ProviderSetting[];
  globalRole: string;
  enabledCount: number;
  hasError?: boolean;
  onSettingsChange: (settings: ProviderSetting[]) => void;
  onRoleChange: (role: string) => void;
}

function ExpandedSidebar({
  onCollapse,
  providers,
  providerSettings,
  globalRole,
  enabledCount,
  hasError,
  onSettingsChange,
  onRoleChange,
}: ExpandedSidebarProps) {
  return (
    <>
      {hasError && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20">
          <p className="text-[#ff453a] text-xs">Backend not connected</p>
        </div>
      )}

      <div className="bg-[#1d1d1f] rounded-2xl border border-[rgba(255,255,255,0.08)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={onCollapse}
              className="p-1.5 -ml-1 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors"
              title="Collapse sidebar"
            >
              <CollapseIcon />
            </button>
            <h2 className="text-sm font-medium text-[#f5f5f7]">Configuration</h2>
          </div>
          <a href="/settings" className="text-xs text-[#0071e3] hover:text-[#0077ed] transition-colors">
            Advanced →
          </a>
        </div>

        <div className="mb-5">
          <RoleSelector selectedRole={globalRole} onRoleChange={onRoleChange} />
        </div>

        <ProviderConfigPanel
          providers={providers}
          settings={providerSettings}
          onSettingsChange={onSettingsChange}
        />

        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <p className="text-xs text-[#86868b]">
            {enabledCount} provider{enabledCount !== 1 ? 's' : ''} enabled
          </p>
        </div>
      </div>
    </>
  );
}

// Collapsed Sidebar
interface CollapsedSidebarProps {
  onExpand: () => void;
  providers: ProviderInfo[];
  providerSettings: ProviderSetting[];
}

function CollapsedSidebar({ onExpand, providers, providerSettings }: CollapsedSidebarProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onExpand}
        className="w-10 h-10 rounded-xl bg-[#1d1d1f] hover:bg-[#2d2d2d] flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.08)]"
        title="Expand sidebar"
      >
        <ExpandIcon />
      </button>

      <div className="h-px bg-[rgba(255,255,255,0.08)] mx-1" />

      {providers.map((p) => {
        const setting = providerSettings.find((s) => s.provider === p.name);
        const info = AI_PROVIDER_INFO[p.name];
        const isActive = setting?.enabled && p.available;
        const isReady = !setting?.enabled && p.available;
        const isOffline = !p.available;
        const status = isActive ? 'active' : isReady ? 'ready' : 'offline';

        return (
          <button
            key={p.name}
            onClick={onExpand}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative border ${
              isActive
                ? 'bg-white/10 border-white/20'
                : isReady
                  ? 'bg-white/5 border-white/10 opacity-60'
                  : 'bg-white/5 border-white/5 opacity-30'
            }`}
            title={`${info.displayName} (${status})`}
            style={{ color: isActive ? info.color : isReady ? info.color : undefined }}
          >
            <ProviderIcon provider={p.name} className={`w-5 h-5 ${isOffline ? 'text-white/30' : ''}`} />
            <span className="absolute -top-0.5 -right-0.5">
              <StatusDot status={status} size="lg" showBorder />
            </span>
          </button>
        );
      })}

      <div className="h-px bg-[rgba(255,255,255,0.08)] mx-1" />

      <a
        href="/settings"
        className="w-10 h-10 rounded-xl bg-[#1d1d1f] hover:bg-[#2d2d2d] flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.08)]"
        title="Advanced Settings"
      >
        <SettingsIcon />
      </a>
    </div>
  );
}

// Icons
function CollapseIcon() {
  return (
    <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

