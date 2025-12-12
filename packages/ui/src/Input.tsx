import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-normal text-white/60 ml-1">{label}</label>}
      <input
        className={`
          px-4 py-3 rounded-xl
          bg-white/10 backdrop-blur-xl border border-white/20
          text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30
          transition-all duration-200
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
};
