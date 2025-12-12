'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, Button, Spinner } from '@repo/ui';
import { Strings, AI_PROVIDER_INFO } from '@repo/shared';
import {
  Header,
  ProviderConfigPanel,
  ChatMessage,
  ChatInput,
  ResponseDetails,
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
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-gray-400">Loading AI providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <Header />

      <main className="relative flex-1 flex overflow-hidden pt-20">
        <div className="flex w-full max-w-[1600px] mx-auto px-4 gap-4">
          {/* Left Panel - Configuration (Collapsible) */}
          <div
            className={`flex-shrink-0 py-4 overflow-y-auto hidden lg:block transition-all duration-300 ${
              sidebarOpen ? 'w-80' : 'w-14'
            }`}
          >
            {sidebarOpen ? (
              /* Expanded View */
              <>
                {settingsError && (
                  <Card
                    variant="default"
                    padding="sm"
                    className="mb-4 border-amber-500/30 bg-amber-500/10"
                  >
                    <p className="text-amber-400 text-xs">Backend not connected</p>
                  </Card>
                )}

                <Card variant="elevated" padding="md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-1 -ml-1 rounded hover:bg-white/10 transition-colors"
                        title="Collapse sidebar"
                      >
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <h2 className="text-sm font-semibold">Configuration</h2>
                    </div>
                    <a
                      href="/settings"
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Advanced →
                    </a>
                  </div>

                  {/* Global Role Selector */}
                  <div className="mb-4">
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

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400">
                      {enabledCount} provider{enabledCount !== 1 ? 's' : ''} enabled
                    </p>
                  </div>
                </Card>
              </>
            ) : (
              /* Collapsed View - Icons Only */
              <div className="space-y-2">
                {/* Expand Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Expand sidebar"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <div className="h-px bg-white/10 mx-1" />

                {providers.map((p) => {
                  const setting = providerSettings.find((s) => s.provider === p.name);
                  const info = AI_PROVIDER_INFO[p.name];
                  return (
                    <button
                      key={p.name}
                      onClick={() => setSidebarOpen(true)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative ${
                        setting?.enabled ? 'bg-white/10' : 'bg-white/5 opacity-50'
                      }`}
                      title={`${info.displayName}${setting?.enabled ? ' (enabled)' : ''}`}
                      style={{ color: info.color }}
                    >
                      <ProviderIcon provider={p.name} className="w-5 h-5" />
                      {setting?.enabled && p.available && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-heartbeat border border-[#0a0a0f]" />
                      )}
                    </button>
                  );
                })}

                <div className="h-px bg-white/10 mx-1" />

                <a
                  href="/settings"
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Advanced Settings"
                >
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Right Panel - Chat (Flexible Width) */}
          <div className="flex-1 flex flex-col min-w-0 py-4">
            {/* Server Offline Banner */}
            {settingsError && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                    <svg
                      className="w-10 h-10 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Server Offline</h2>
                  <p className="text-gray-400 text-lg mb-4">
                    Unable to connect to the backend server
                  </p>
                  <div className="bg-white/5 rounded-xl px-6 py-4 inline-block">
                    <p className="text-gray-500 text-sm mb-2">Expected backend URL:</p>
                    <code className="text-blue-400 font-mono">http://localhost:6201</code>
                  </div>
                  <p className="text-gray-500 text-sm mt-6">
                    Please start the backend server and refresh the page
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            )}

            {/* Chat Messages (Scrollable) */}
            {!settingsError && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {chat.messages.length === 0 ? (
                <Card variant="default" padding="lg" className="text-center">
                  <div className="py-8">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{Strings.app.name}</h3>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto mb-4">
                      Configure your AI providers on the left panel. Each provider can have its own
                      model and custom system prompt.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {providers
                        .filter((p) => p.available)
                        .map((p) => (
                          <span
                            key={p.name}
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${p.color}20`, color: p.color }}
                          >
                            {p.displayName}
                          </span>
                        ))}
                    </div>
                  </div>
                </Card>
              ) : (
                chat.messages.map((message) => <ChatMessage key={message.id} message={message} />)
              )}

              {chat.error && (
                <Card variant="default" padding="md" className="border-red-500/30 bg-red-500/10">
                  <p className="text-red-400">{chat.error}</p>
                </Card>
              )}

              {/* Response Details */}
              {chat.lastConsensus && chat.lastResponses && (
                <ResponseDetails consensus={chat.lastConsensus} responses={chat.lastResponses} />
              )}

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
                <p className="text-center text-amber-400 text-xs mt-2">
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
