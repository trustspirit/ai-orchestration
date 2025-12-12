import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) => {
  const baseStyle =
    'inline-flex items-center justify-center font-normal tracking-tight transition-all duration-200 active:scale-[0.98]';

  const variants = {
    primary:
      'bg-[#0071e3] text-white hover:bg-[#0077ed] rounded-full',
    secondary:
      'bg-[#1d1d1f] text-[#f5f5f7] hover:bg-[#2d2d2d] border border-[rgba(255,255,255,0.12)] rounded-xl',
    tertiary:
      'bg-transparent text-[#0071e3] hover:text-[#0077ed] hover:bg-[rgba(0,113,227,0.1)] rounded-xl',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    />
  );
};
