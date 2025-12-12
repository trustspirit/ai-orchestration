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
        {/* Outer rings */}
        <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" opacity="0.1" />
        {/* Connecting lines */}
        <path
          d="M40 40L18 18M40 40L62 18M40 40L18 62M40 40L62 62"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Corner nodes */}
        <circle cx="18" cy="18" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="62" cy="18" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="18" cy="62" r="4" fill="currentColor" opacity="0.5" />
        <circle cx="62" cy="62" r="4" fill="currentColor" opacity="0.5" />
        {/* Center hub */}
        <circle cx="40" cy="40" r="10" fill="currentColor" opacity="0.9" />
        <circle cx="40" cy="40" r="5" fill="black" />
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
      {/* Outer ring */}
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Connecting lines */}
      <path
        d="M14 14L7 7M14 14L21 7M14 14L7 21M14 14L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Corner nodes */}
      <circle cx="7" cy="7" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="21" cy="7" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="7" cy="21" r="2" fill="currentColor" opacity="0.6" />
      <circle cx="21" cy="21" r="2" fill="currentColor" opacity="0.6" />
      {/* Center hub */}
      <circle cx="14" cy="14" r="4" fill="currentColor" />
      <circle cx="14" cy="14" r="2" fill="black" />
    </svg>
  );
};
