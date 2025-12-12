import { Spinner } from '@repo/ui';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center pt-12">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white/50 text-sm">Loading...</p>
      </div>
    </div>
  );
}

