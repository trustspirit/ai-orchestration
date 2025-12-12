'use client';

import * as React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleProps) => {
  const sizes = {
    sm: { track: 'w-9 h-5', thumb: 'w-4 h-4', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-8', thumb: 'w-6 h-6', translate: 'translate-x-6' },
  };

  const sizeConfig = sizes[size];

  return (
    <label
      className={`flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          ${sizeConfig.track}
          relative inline-flex shrink-0 items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-[rgba(0,113,227,0.3)]
          ${checked ? 'bg-[#30d158]' : 'bg-[rgba(255,255,255,0.16)]'}
        `}
      >
        <span
          className={`
            ${sizeConfig.thumb}
            inline-block transform rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out
            ${checked ? sizeConfig.translate : 'translate-x-0.5'}
          `}
        />
      </button>
      {label && <span className="text-sm font-normal text-[#f5f5f7]">{label}</span>}
    </label>
  );
};
