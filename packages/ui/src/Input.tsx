import * as React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-normal text-[#86868b] ml-1">{label}</label>
      )}
      <input
        className={`
          px-4 py-3 rounded-xl
          bg-[#1d1d1f] border border-[rgba(255,255,255,0.12)]
          text-[#f5f5f7] placeholder-[#6e6e73]
          focus:outline-none focus:ring-2 focus:ring-[rgba(0,113,227,0.5)] focus:border-[#0071e3]
          transition-all duration-200
          ${className || ''}
        `}
        {...props}
      />
    </div>
  );
};
