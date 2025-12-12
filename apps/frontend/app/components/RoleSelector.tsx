'use client';

import { Select } from '@repo/ui';
import { Strings } from '@repo/shared';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const roleOptions = [
  { value: 'default', label: 'Default Assistant', description: Strings.roles.default },
  { value: 'analyst', label: 'Analyst', description: Strings.roles.analyst },
  { value: 'creative', label: 'Creative', description: Strings.roles.creative },
  { value: 'technical', label: 'Technical Expert', description: Strings.roles.technical },
  { value: 'educator', label: 'Educator', description: Strings.roles.educator },
  { value: 'researcher', label: 'Researcher', description: Strings.roles.researcher },
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

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <Select
      label="AI Role"
      options={roleOptions}
      value={selectedRole}
      onChange={onRoleChange}
      placeholder="Select a role"
    />
  );
}

