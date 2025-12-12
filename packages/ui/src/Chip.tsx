'use client';

import * as React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  color?: string;
  disabled?: boolean;
}

export const Chip = ({
  label,
  selected = false,
  onClick,
  onRemove,
  color,
  disabled = false,
}: ChipProps) => {
  const customColorStyle = color
    ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color }
    : {};

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full
        font-medium text-sm transition-all duration-200
        border focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${
          selected
            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
        }
      `}
      style={color && selected ? customColorStyle : undefined}
    >
      <span>{label}</span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-red-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
    </button>
  );
};
