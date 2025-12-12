'use client';

import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) => {
  const baseStyle = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-white/10 text-white',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  );
};
