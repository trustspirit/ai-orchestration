'use client';

import * as React from 'react';
import type { AvatarVariantType, CommonSizeType } from './types';

interface AvatarProps {
  variant?: AvatarVariantType;
  size?: CommonSizeType;
  children?: React.ReactNode;
  className?: string;
}

const sizeMap: Record<CommonSizeType, string> = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

const variantMap: Record<AvatarVariantType, string> = {
  user: 'bg-white/90 border-white/20 text-black',
  ai: 'bg-white/10 border-white/20 text-white',
  system: 'bg-white/5 border-white/10 text-white/60',
};

const iconSizeMap: Record<CommonSizeType, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const Avatar = ({ variant = 'user', size = 'md', children, className }: AvatarProps) => {
  const defaultIcon =
    variant === 'user' ? (
      <svg className={iconSizeMap[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ) : (
      <svg className={iconSizeMap[size]} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 12L6 6M12 12L18 6M12 12L6 18M12 12L18 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="black" />
      </svg>
    );

  return (
    <div
      className={`
        ${sizeMap[size]} 
        rounded-lg flex items-center justify-center flex-shrink-0 
        backdrop-blur-xl border
        ${variantMap[variant]}
        ${className || ''}
      `}
    >
      {children || defaultIcon}
    </div>
  );
};
