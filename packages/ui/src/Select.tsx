'use client';

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  size = 'md',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeStyles = {
    sm: {
      label: 'text-[11px]',
      button: 'px-3 py-2 text-xs',
      option: 'px-3 py-2 text-xs',
      description: 'text-[10px]',
      gap: 'gap-1',
    },
    md: {
      label: 'text-sm',
      button: 'px-4 py-3 text-sm',
      option: 'px-4 py-2.5 text-sm',
      description: 'text-xs',
      gap: 'gap-2',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={`flex flex-col ${styles.gap}`} ref={selectRef}>
      {label && <label className={`${styles.label} font-normal text-white/50`}>{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full ${styles.button} rounded-lg text-left
            bg-white/10 backdrop-blur-xl border border-white/15
            text-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-white/30
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/15 cursor-pointer'}
            ${isOpen ? 'ring-2 ring-white/30' : ''}
          `}
        >
          <span className={selectedOption ? 'text-white' : 'text-white/40'}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className={`w-3.5 h-3.5 text-white/50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-1 py-1 rounded-lg bg-black/90 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[250px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full ${styles.option} text-left transition-colors duration-150
                  hover:bg-white/10
                  ${option.value === value ? 'bg-white/15 text-white' : 'text-white/80'}
                `}
              >
                <div className="font-normal">{option.label}</div>
                {option.description && (
                  <div className={`${styles.description} text-white/40 mt-0.5`}>{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
