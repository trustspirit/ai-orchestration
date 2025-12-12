'use client';

import { useState } from 'react';
import { Sidebar, ChatArea, ServerOfflineBanner, LoadingScreen, getRolePrompt } from './components';
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

  const globalSystemRole = getRolePrompt(globalRole);
  const chat = useChat(providerSettings, globalSystemRole);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const enabledCount = providerSettings.filter((s) => s.enabled).length;

  // Loading state
  if (settingsLoading) {
    return <LoadingScreen />;
  }

  // Settings change handler
  const handleSettingsChange = (newSettings: typeof providerSettings) => {
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
  };

  return (
    <div className="h-screen bg-black text-[#f5f5f7] flex flex-col overflow-hidden pt-12">
      <main className="relative flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration (Fixed Position) */}
        <div
          className={`fixed left-6 top-[60px] bottom-6 overflow-y-auto hidden lg:block transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-72' : 'w-12'
          }`}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            providers={providers}
            providerSettings={providerSettings}
            globalRole={globalRole}
            enabledCount={enabledCount}
            hasError={!!settingsError}
            onSettingsChange={handleSettingsChange}
            onRoleChange={updateGlobalRole}
          />
        </div>

        {/* Center Panel - Chat (Centered) */}
        <div className="flex-1 flex justify-center px-6 min-h-0">
          <div className="w-full max-w-4xl h-full">
            {settingsError ? (
              <ServerOfflineBanner onRetry={() => window.location.reload()} />
            ) : (
              <ChatArea
                messages={chat.messages}
                isLoading={chat.isLoading}
                error={chat.error}
                providers={providers}
                enabledCount={enabledCount}
                onSendMessage={chat.sendMessage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
