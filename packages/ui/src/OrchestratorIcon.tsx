'use client';

import * as React from 'react';

interface OrchestratorIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const OrchestratorIcon = ({
  size = 'md',
  className,
  animated = false,
}: OrchestratorIconProps) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
    xl: 'w-20 h-20',
  };

  // For xl size, use more detailed version
  if (size === 'xl') {
    return (
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizes[size]} text-white ${className || ''}`}
      >
        {/* Asymmetric molecular/network structure */}
        {/* Main connections */}
        <path
          d="M32 28L20 16M32 28L48 20M32 28L28 48M32 28L52 36"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M52 36L64 28M52 36L60 56M52 36L28 48"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M28 48L16 58M28 48L44 64"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Nodes - varying sizes for depth */}
        <circle cx="20" cy="16" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="48" cy="20" r="2.5" fill="currentColor" opacity="0.5" />
        <circle cx="64" cy="28" r="2" fill="currentColor" opacity="0.35" />
        <circle cx="16" cy="58" r="2.5" fill="currentColor" opacity="0.4" />
        <circle cx="60" cy="56" r="3" fill="currentColor" opacity="0.45" />
        <circle cx="44" cy="64" r="2" fill="currentColor" opacity="0.35" />

        {/* Secondary nodes */}
        <circle cx="28" cy="48" r="4" fill="currentColor" opacity="0.7" />
        <circle cx="52" cy="36" r="3.5" fill="currentColor" opacity="0.6" />

        {/* Primary hub - slightly off-center */}
        <circle cx="32" cy="28" r="6" fill="currentColor" opacity="0.9" />
        <circle cx="32" cy="28" r="3" fill="black" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizes[size]} text-current ${animated ? 'animate-pulse' : ''} ${className || ''}`}
    >
      {/* Asymmetric molecular structure - compact version */}
      {/* Connections */}
      <path
        d="M11 10L6 5M11 10L18 7M11 10L9 17M11 10L19 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M19 13L24 10M19 13L22 21M19 13L9 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M9 17L5 22M9 17L16 23"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Outer nodes */}
      <circle cx="6" cy="5" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="18" cy="7" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="10" r="1" fill="currentColor" opacity="0.35" />
      <circle cx="5" cy="22" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="22" cy="21" r="1.5" fill="currentColor" opacity="0.45" />
      <circle cx="16" cy="23" r="1" fill="currentColor" opacity="0.35" />

      {/* Secondary hubs */}
      <circle cx="9" cy="17" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="13" r="1.8" fill="currentColor" opacity="0.6" />

      {/* Primary hub */}
      <circle cx="11" cy="10" r="3" fill="currentColor" />
      <circle cx="11" cy="10" r="1.5" fill="black" />
    </svg>
  );
};
