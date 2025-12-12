'use client';

import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) => {
  const baseStyle = 'rounded-2xl transition-all duration-200';

  const variants = {
    default: 'bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)]',
    elevated:
      'bg-[#1d1d1f] border border-[rgba(255,255,255,0.08)] shadow-lg shadow-black/40',
    outlined: 'bg-transparent border border-[rgba(255,255,255,0.12)]',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${paddings[padding]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
