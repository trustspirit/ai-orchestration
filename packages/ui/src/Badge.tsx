'use client';

import * as React from 'react';
import type { BadgeVariantType } from './types';

type SizeType = 'sm' | 'md';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariantType;
  size?: SizeType;
}

const variantMap: Record<BadgeVariantType, string> = {
  default: 'bg-white/10 text-white/80 border border-white/20',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
};

const sizeMap: Record<SizeType, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const Badge = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full backdrop-blur-xl';

  return (
    <span
      className={`${baseStyle} ${variantMap[variant]} ${sizeMap[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};
