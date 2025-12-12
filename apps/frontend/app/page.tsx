'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, Button, Spinner } from '@repo/ui';
import { Strings, AI_PROVIDER_INFO } from '@repo/shared';
import {
  Header,
  ProviderConfigPanel,
  ChatMessage,
  ChatInput,
  RoleSelector,
  getRolePrompt,
  ProviderIcon,
} from './components';
import { useChat } from './hooks/useChat';
import { useSettings } from './hooks/useSettings';

export default function Home() {
  const {
    providers,
    providerSettings,
    globalRole,
    isLoading: settingsLoading,
    error: settingsError,
    updateProviderSetting,
    updateGlobalRole,
  } = useSettings();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const globalSystemRole = getRolePrompt(globalRole);
  const chat = useChat(providerSettings, globalSystemRole);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const enabledCount = providerSettings.filter((s) => s.enabled).length;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-[#86868b]">Loading AI providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-[#f5f5f7] flex flex-col overflow-hidden">
      <Header />

      <main className="relative flex-1 flex overflow-hidden pt-12">
        <div className="flex w-full max-w-[1200px] mx-auto px-6 gap-6">
          {/* Left Panel - Configuration (Collapsible) */}
          <div
            className={`flex-shrink-0 py-6 overflow-y-auto hidden lg:block transition-all duration-300 ${
              sidebarOpen ? 'w-72' : 'w-12'
            }`}
          >
            {sidebarOpen ? (
              /* Expanded View */
              <>
                {settingsError && (
                  <div className="mb-4 px-4 py-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20">
                    <p className="text-[#ff453a] text-xs">Backend not connected</p>
                  </div>
                )}

                <div className="bg-[#1d1d1f] rounded-2xl border border-[rgba(255,255,255,0.08)] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1.5 -ml-1 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                        title="Collapse sidebar"
                      >
                        <svg
                          className="w-4 h-4 text-[#86868b]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <h2 className="text-sm font-medium text-[#f5f5f7]">Configuration</h2>
                    </div>
                    <a
                      href="/settings"
                      className="text-xs text-[#0071e3] hover:text-[#0077ed] transition-colors"
                    >
                      Advanced →
                    </a>
                  </div>

                  {/* Global Role Selector */}
                  <div className="mb-5">
                    <RoleSelector selectedRole={globalRole} onRoleChange={updateGlobalRole} />
                  </div>

                  {/* Provider Configuration */}
                  <ProviderConfigPanel
                    providers={providers}
                    settings={providerSettings}
                    onSettingsChange={(newSettings) => {
                      newSettings.forEach((setting) => {
                        const existing = providerSettings.find(
                          (s) => s.provider === setting.provider,
                        );
                        if (
                          !existing ||
                          existing.enabled !== setting.enabled ||
                          existing.model !== setting.model ||
                          existing.systemPrompt !== setting.systemPrompt
                        ) {
                          updateProviderSetting(setting.provider, setting);
                        }
                      });
                    }}
                  />

                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                    <p className="text-xs text-[#86868b]">
                      {enabledCount} provider{enabledCount !== 1 ? 's' : ''} enabled
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Collapsed View - Icons Only */
              <div className="space-y-2">
                {/* Expand Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-10 h-10 rounded-xl bg-[#1d1d1f] hover:bg-[#2d2d2d] flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.08)]"
                  title="Expand sidebar"
                >
                  <svg
                    className="w-4 h-4 text-[#86868b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <div className="h-px bg-[rgba(255,255,255,0.08)] mx-1" />

                {providers.map((p) => {
                  const setting = providerSettings.find((s) => s.provider === p.name);
                  const info = AI_PROVIDER_INFO[p.name];
                  return (
                    <button
                      key={p.name}
                      onClick={() => setSidebarOpen(true)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative border border-[rgba(255,255,255,0.08)] ${
                        setting?.enabled
                          ? 'bg-[#1d1d1f]'
                          : 'bg-[#1d1d1f]/50 opacity-40'
                      }`}
                      title={`${info.displayName}${setting?.enabled ? ' (enabled)' : ''}`}
                      style={{ color: info.color }}
                    >
                      <ProviderIcon provider={p.name} className="w-5 h-5" />
                      {setting?.enabled && p.available && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#30d158] animate-heartbeat border-2 border-black" />
                      )}
                    </button>
                  );
                })}

                <div className="h-px bg-[rgba(255,255,255,0.08)] mx-1" />

                <a
                  href="/settings"
                  className="w-10 h-10 rounded-xl bg-[#1d1d1f] hover:bg-[#2d2d2d] flex items-center justify-center transition-colors border border-[rgba(255,255,255,0.08)]"
                  title="Advanced Settings"
                >
                  <svg
                    className="w-4 h-4 text-[#86868b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Right Panel - Chat (Flexible Width) */}
          <div className="flex-1 flex flex-col min-w-0 py-6">
            {/* Server Offline Banner */}
            {settingsError && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ff453a]/10 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#ff453a]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">
                    Server Offline
                  </h2>
                  <p className="text-[#86868b] text-base mb-6">
                    Unable to connect to the backend server
                  </p>
                  <div className="bg-[#1d1d1f] rounded-xl px-5 py-4 mb-6 border border-[rgba(255,255,255,0.08)]">
                    <p className="text-[#6e6e73] text-sm mb-1">Expected backend URL</p>
                    <code className="text-[#0071e3] font-mono text-sm">http://localhost:6201</code>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-normal rounded-full transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages (Scrollable) */}
            {!settingsError && (
              <div className={`flex-1 ${chat.messages.length > 0 ? 'overflow-y-auto pr-2' : 'flex items-center justify-center'}`}>
                {chat.messages.length === 0 ? (
                  <div className="text-center max-w-lg">
                      <div className="w-20 h-20 mx-auto mb-6">
                        <svg
                          viewBox="0 0 80 80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Outer ring */}
                          <circle cx="40" cy="40" r="38" stroke="url(#welcomeGradient)" strokeWidth="1" opacity="0.3" />
                          {/* Connecting lines */}
                          <path
                            d="M40 40L20 20M40 40L60 20M40 40L20 60M40 40L60 60M40 40L40 12M40 40L40 68M40 40L12 40M40 40L68 40"
                            stroke="url(#welcomeGradient)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            opacity="0.6"
                          />
                          {/* Outer nodes */}
                          <circle cx="20" cy="20" r="5" fill="#0071e3" />
                          <circle cx="60" cy="20" r="5" fill="#30d158" />
                          <circle cx="20" cy="60" r="5" fill="#ff9f0a" />
                          <circle cx="60" cy="60" r="5" fill="#bf5af2" />
                          <circle cx="40" cy="12" r="4" fill="#0071e3" opacity="0.7" />
                          <circle cx="40" cy="68" r="4" fill="#30d158" opacity="0.7" />
                          <circle cx="12" cy="40" r="4" fill="#ff9f0a" opacity="0.7" />
                          <circle cx="68" cy="40" r="4" fill="#bf5af2" opacity="0.7" />
                          {/* Center hub */}
                          <circle cx="40" cy="40" r="12" fill="url(#centerWelcomeGradient)" />
                          <circle cx="40" cy="40" r="8" fill="#1d1d1f" />
                          <circle cx="40" cy="40" r="5" fill="#f5f5f7" />
                          {/* Gradients */}
                          <defs>
                            <linearGradient id="welcomeGradient" x1="12" y1="12" x2="68" y2="68" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#0071e3" />
                              <stop offset="0.33" stopColor="#30d158" />
                              <stop offset="0.66" stopColor="#bf5af2" />
                              <stop offset="1" stopColor="#ff9f0a" />
                            </linearGradient>
                            <linearGradient id="centerWelcomeGradient" x1="28" y1="28" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#0071e3" />
                              <stop offset="1" stopColor="#bf5af2" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">
                        {Strings.app.name}
                      </h3>
                      <p className="text-[#86868b] text-sm mb-6 leading-relaxed">
                        Configure your AI providers on the left panel. Each provider can have its
                        own model and custom system prompt.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {providers
                          .filter((p) => p.available)
                          .map((p) => (
                            <span
                              key={p.name}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]"
                              style={{ color: p.color }}
                            >
                              <ProviderIcon provider={p.name} className="w-3.5 h-3.5" />
                              {p.displayName}
                            </span>
                          ))}
                      </div>
                    </div>
                ) : (
                  chat.messages.map((message) => <ChatMessage key={message.id} message={message} />)
                )}

                {/* Loading indicator - shown below the last message */}
                {chat.isLoading && (
                  <div className="py-6 border-b border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#0071e3] to-[#bf5af2]">
                        <svg className="w-4 h-4 text-white animate-pulse" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12L6 6M12 12L18 6M12 12L6 18M12 12L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="12" cy="12" r="2" fill="currentColor" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-[#f5f5f7]">AI Orchestrator</span>
                      </div>
                    </div>
                    <div className="pl-11">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-[#0071e3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-[#30d158] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-[#bf5af2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="w-2 h-2 bg-[#ff9f0a] rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                        </div>
                        <span className="text-sm text-[#86868b]">AI models are thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                {chat.error && (
                  <div className="px-4 py-3 rounded-xl bg-[#ff453a]/10 border border-[#ff453a]/20">
                    <p className="text-[#ff453a] text-sm">{chat.error}</p>
                  </div>
                )}

                {/* Bottom spacer - keeps last message in center-ish position */}
                {chat.messages.length > 0 && <div className="h-[30vh]" />}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Chat Input (Fixed at Bottom) */}
            {!settingsError && (
              <div className="flex-shrink-0 pt-4">
                <ChatInput
                  onSend={chat.sendMessage}
                  isLoading={chat.isLoading}
                  disabled={enabledCount === 0}
                />
                {enabledCount === 0 && (
                  <p className="text-center text-[#ff9f0a] text-xs mt-3">
                    Please enable at least one AI provider to start chatting
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
