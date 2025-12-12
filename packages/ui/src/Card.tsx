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
  const baseStyle = 'rounded-2xl transition-all duration-300';
  
  const variants = {
    default: 'bg-white/5 backdrop-blur-xl border border-white/10',
    elevated: 'bg-white/8 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20',
    outlined: 'bg-transparent border-2 border-white/20',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
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

