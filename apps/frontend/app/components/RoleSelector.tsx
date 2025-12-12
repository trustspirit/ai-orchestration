'use client';

import { Select } from '@repo/ui';
import { Strings } from '@repo/shared';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  label?: string;
  size?: 'sm' | 'md';
  showInherit?: boolean;
}

export const roleOptions = [
  { value: 'default', label: 'Default Assistant', description: Strings.roles.default },
  { value: 'analyst', label: 'Analyst', description: Strings.roles.analyst },
  { value: 'creative', label: 'Creative', description: Strings.roles.creative },
  { value: 'technical', label: 'Technical Expert', description: Strings.roles.technical },
  { value: 'educator', label: 'Educator', description: Strings.roles.educator },
  { value: 'researcher', label: 'Researcher', description: Strings.roles.researcher },
];

export const roleOptionsWithInherit = [
  { value: '', label: 'Use Global Role', description: 'Inherit from global AI role setting' },
  ...roleOptions,
];

const rolePrompts: Record<string, string> = {
  default: Strings.roles.default,
  analyst: Strings.roles.analyst,
  creative: Strings.roles.creative,
  technical: Strings.roles.technical,
  educator: Strings.roles.educator,
  researcher: Strings.roles.researcher,
};

export function getRolePrompt(roleId: string): string {
  return rolePrompts[roleId] || rolePrompts.default;
}

export function RoleSelector({
  selectedRole,
  onRoleChange,
  label = 'AI Role',
  size = 'md',
  showInherit = false,
}: RoleSelectorProps) {
  const options = showInherit ? roleOptionsWithInherit : roleOptions;

  return (
    <Select
      label={label}
      options={options}
      value={selectedRole}
      onChange={onRoleChange}
      placeholder="Select a role"
      size={size}
    />
  );
}
