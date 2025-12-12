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
}

export const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
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

  return (
    <div className="flex flex-col gap-2" ref={selectRef}>
      {label && <label className="text-sm font-normal text-[#86868b] ml-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 rounded-xl text-left
            bg-[#1d1d1f] border border-[rgba(255,255,255,0.12)]
            text-[#f5f5f7] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[rgba(0,113,227,0.5)]
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#2d2d2d] cursor-pointer'}
            ${isOpen ? 'ring-2 ring-[rgba(0,113,227,0.5)]' : ''}
          `}
        >
          <span className={selectedOption ? 'text-[#f5f5f7]' : 'text-[#6e6e73]'}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className={`w-4 h-4 text-[#86868b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-[100] w-full mt-2 py-1 rounded-xl bg-[#2d2d2d] border border-[rgba(255,255,255,0.12)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2.5 text-left transition-colors duration-150
                  hover:bg-[rgba(255,255,255,0.08)]
                  ${option.value === value ? 'bg-[rgba(0,113,227,0.15)] text-[#0071e3]' : 'text-[#f5f5f7]'}
                `}
              >
                <div className="font-normal text-sm">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-[#86868b] mt-0.5">{option.description}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
