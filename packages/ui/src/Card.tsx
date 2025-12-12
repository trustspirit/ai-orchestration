'use client';

import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
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
    default: 'bg-white/5 backdrop-blur-xl border border-white/10',
    elevated: 'bg-white/8 backdrop-blur-2xl border border-white/15 shadow-xl shadow-black/20',
    outlined: 'bg-transparent backdrop-blur-xl border border-white/20',
    glass: 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-lg shadow-black/10',
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
