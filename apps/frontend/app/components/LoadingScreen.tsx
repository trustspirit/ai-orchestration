'use client';

import { Spinner } from '@repo/ui';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading AI providers...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] flex items-center justify-center pt-12">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-[#86868b]">{message}</p>
      </div>
    </div>
  );
}
