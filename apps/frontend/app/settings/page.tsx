'use client';

import { useState } from 'react';
import { Card, Button, Input, Toggle, Textarea, Badge } from '@repo/ui';
import { Strings, AI_PROVIDER_INFO } from '@repo/shared';
import type { AiProviderName, RoleConfig } from '@repo/shared';
import { Header } from '../components';

const defaultRoles: RoleConfig[] = [
  { id: 'default', name: 'Default Assistant', prompt: Strings.roles.default, isDefault: true },
  { id: 'analyst', name: 'Analyst', prompt: Strings.roles.analyst },
  { id: 'creative', name: 'Creative', prompt: Strings.roles.creative },
  { id: 'technical', name: 'Technical Expert', prompt: Strings.roles.technical },
  { id: 'educator', name: 'Educator', prompt: Strings.roles.educator },
  { id: 'researcher', name: 'Researcher', prompt: Strings.roles.researcher },
];

export default function SettingsPage() {
  const [activeProviders, setActiveProviders] = useState<Record<AiProviderName, boolean>>({
    openai: true,
    gemini: true,
    claude: true,
    perplexity: true,
  });
  
  const [roles, setRoles] = useState<RoleConfig[]>(defaultRoles);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePrompt, setNewRolePrompt] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const providers: AiProviderName[] = ['openai', 'gemini', 'claude', 'perplexity'];

  const toggleProvider = (provider: AiProviderName) => {
    setActiveProviders((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }));
  };

  const addRole = () => {
    if (newRoleName.trim() && newRolePrompt.trim()) {
      const newRole: RoleConfig = {
        id: Date.now().toString(),
        name: newRoleName.trim(),
        prompt: newRolePrompt.trim(),
      };
      setRoles((prev) => [...prev, newRole]);
      setNewRoleName('');
      setNewRolePrompt('');
    }
  };

  const deleteRole = (id: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== id && !role.isDefault));
  };

  const updateRole = (id: string, updates: Partial<RoleConfig>) => {
    setRoles((prev) =>
      prev.map((role) => (role.id === id ? { ...role, ...updates } : role))
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[80px]" />
      </div>

      <Header />

      <main className="relative pt-28 pb-8 px-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{Strings.settings.title}</h1>

        {/* AI Providers Section */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {Strings.nav.providers}
          </h2>
          
          <div className="grid gap-4">
            {providers.map((provider) => {
              const info = AI_PROVIDER_INFO[provider];
              return (
                <div
                  key={provider}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${info.color}20` }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: info.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{info.displayName}</h3>
                      <p className="text-sm text-gray-400">{info.description}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={activeProviders[provider]}
                    onChange={() => toggleProvider(provider)}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400">
              <strong>Note:</strong> API keys should be configured on the server via environment variables.
              Contact your administrator to set up provider credentials.
            </p>
          </div>
        </Card>

        {/* Custom Roles Section */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {Strings.settings.customRoles}
          </h2>

          {/* Role List */}
          <div className="space-y-3 mb-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                {editingRole === role.id ? (
                  <div className="space-y-3">
                    <Input
                      value={role.name}
                      onChange={(e) => updateRole(role.id, { name: e.target.value })}
                      placeholder={Strings.settings.roleName}
                    />
                    <Textarea
                      value={role.prompt}
                      onChange={(e) => updateRole(role.id, { prompt: e.target.value })}
                      placeholder={Strings.settings.rolePrompt}
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={() => setEditingRole(null)}>
                        {Strings.actions.save}
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingRole(null)}>
                        {Strings.actions.cancel}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{role.name}</h4>
                        {role.isDefault && (
                          <Badge variant="info" size="sm">Default</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{role.prompt}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setEditingRole(role.id)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {!role.isDefault && (
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Role */}
          <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20">
            <h4 className="font-medium mb-4">{Strings.settings.addRole}</h4>
            <div className="space-y-3">
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder={Strings.settings.roleName}
                label={Strings.settings.roleName}
              />
              <Textarea
                value={newRolePrompt}
                onChange={(e) => setNewRolePrompt(e.target.value)}
                placeholder="e.g., You are a friendly customer support agent..."
                label={Strings.settings.rolePrompt}
                rows={3}
              />
              <Button
                variant="primary"
                onClick={addRole}
                disabled={!newRoleName.trim() || !newRolePrompt.trim()}
              >
                {Strings.settings.addRole}
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button variant="primary" className="px-8">
            {Strings.settings.saveSettings}
          </Button>
        </div>
      </main>
    </div>
  );
}

