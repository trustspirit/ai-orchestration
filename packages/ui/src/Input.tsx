import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-400 ml-1">{label}</label>}
      <input
        className={`px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-md ${className || ''}`}
        {...props}
      />
    </div>
  );
};
