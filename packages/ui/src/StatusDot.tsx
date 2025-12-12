'use client';

import * as React from 'react';
import type { StatusType, CommonSizeType } from './types';

interface StatusDotProps {
  status: StatusType;
  size?: CommonSizeType;
  className?: string;
  showBorder?: boolean;
}

const sizeMap: Record<CommonSizeType, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const statusMap: Record<StatusType, string> = {
  active: 'bg-[#30d158] animate-heartbeat',
  ready: 'bg-white/40',
  offline: 'bg-[#ff453a]/80',
  loading: 'bg-white/60 animate-pulse',
};

export const StatusDot = ({
  status,
  size = 'md',
  className,
  showBorder = false,
}: StatusDotProps) => {
  const borderStyles = showBorder ? 'border-2 border-black' : '';

  return (
    <span
      className={`
        ${sizeMap[size]} 
        rounded-full 
        ${statusMap[status]} 
        ${borderStyles}
        flex-shrink-0
        ${className || ''}
      `}
    />
  );
};
