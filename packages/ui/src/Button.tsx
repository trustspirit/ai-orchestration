import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-white/90 text-black hover:bg-white backdrop-blur-xl rounded-full shadow-sm',
    secondary:
      'bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full',
    tertiary:
      'bg-transparent text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-xl rounded-full',
    glass:
      'bg-white/10 text-white hover:bg-white/15 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-lg shadow-black/10',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      disabled={disabled}
      {...props}
    />
  );
};
