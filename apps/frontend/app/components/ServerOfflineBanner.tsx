'use client';

interface ServerOfflineBannerProps {
  onRetry: () => void;
}

export function ServerOfflineBanner({ onRetry }: ServerOfflineBannerProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#ff453a]/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#ff453a]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">Server Offline</h2>
        <p className="text-[#86868b] text-base mb-6">Unable to connect to the backend server</p>
        <div className="bg-[#1d1d1f] rounded-xl px-5 py-4 mb-6 border border-[rgba(255,255,255,0.08)]">
          <p className="text-[#6e6e73] text-sm mb-1">Expected backend URL</p>
          <code className="text-[#0071e3] font-mono text-sm">http://localhost:6201</code>
        </div>
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-normal rounded-full transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

