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
  const baseStyle = 'inline-flex items-center font-normal rounded-full';

  const variants = {
    default: 'bg-[rgba(255,255,255,0.08)] text-[#f5f5f7]',
    success: 'bg-[rgba(48,209,88,0.12)] text-[#30d158]',
    warning: 'bg-[rgba(255,159,10,0.12)] text-[#ff9f0a]',
    error: 'bg-[rgba(255,69,58,0.12)] text-[#ff453a]',
    info: 'bg-[rgba(0,113,227,0.12)] text-[#0071e3]',
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
