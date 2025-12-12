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
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-white/30
          ${checked ? 'bg-white/90' : 'bg-white/20 backdrop-blur-xl border border-white/20'}
        `}
      >
        <span
          className={`
            ${sizeConfig.thumb}
            inline-block transform rounded-full shadow-sm
            transition-all duration-200 ease-in-out
            ${checked ? `${sizeConfig.translate} bg-black` : 'translate-x-0.5 bg-white/80'}
          `}
        />
      </button>
      {label && <span className="text-sm font-normal text-white/80">{label}</span>}
    </label>
  );
};
