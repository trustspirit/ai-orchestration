'use client';

import { useEffect, useRef } from 'react';
import { Card, Button, Spinner } from '@repo/ui';
import { Strings } from '@repo/shared';
import {
  Header,
  ProviderConfigPanel,
  ChatMessage,
  ChatInput,
  ResponseDetails,
  RoleSelector,
  getRolePrompt,
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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <Header />

      <main className="relative pt-28 pb-8 px-6 max-w-6xl mx-auto">
        {settingsError && (
          <Card variant="default" padding="md" className="mb-6 border-amber-500/30 bg-amber-500/10">
            <p className="text-amber-400">Warning: Could not connect to backend. {settingsError}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="lg" className="sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Configuration</h2>
                <a
                  href="/settings"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Advanced →
                </a>
              </div>

              {/* Global Role Selector */}
              <div className="mb-6">
                <RoleSelector selectedRole={globalRole} onRoleChange={updateGlobalRole} />
              </div>

              {/* Provider Configuration */}
              <ProviderConfigPanel
                providers={providers}
                settings={providerSettings}
                onSettingsChange={(newSettings) => {
                  newSettings.forEach((setting) => {
                    const existing = providerSettings.find((s) => s.provider === setting.provider);
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

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400">
                  {enabledCount} provider{enabledCount !== 1 ? 's' : ''} enabled
                </p>
                <p className="text-xs text-gray-500 mt-1">Settings auto-saved to browser</p>
              </div>
            </Card>
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-2">
            {/* Chat Messages */}
            <div className="space-y-4 mb-6 min-h-[400px]">
              {chat.messages.length === 0 ? (
                <Card variant="default" padding="lg" className="text-center">
                  <div className="py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
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
                    <h3 className="text-xl font-semibold mb-2">{Strings.app.name}</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-4">
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

              <div ref={messagesEndRef} />
            </div>

            {/* Response Details */}
            {chat.lastConsensus && chat.lastResponses && (
              <ResponseDetails consensus={chat.lastConsensus} responses={chat.lastResponses} />
            )}

            {/* Chat Input */}
            <div className="sticky bottom-4 mt-6">
              <ChatInput
                onSend={chat.sendMessage}
                isLoading={chat.isLoading}
                disabled={enabledCount === 0}
              />
              {enabledCount === 0 && (
                <p className="text-center text-amber-400 text-sm mt-2">
                  Please enable at least one AI provider to start chatting
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
