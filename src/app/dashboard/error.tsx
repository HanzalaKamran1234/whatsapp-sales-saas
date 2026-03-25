'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
      <p className="text-neutral-400 mb-6 max-w-md">
        We encountered a client-side error while loading the dashboard. This has been logged, but you can try refreshing the page.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={() => reset()}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg font-medium transition-all border border-neutral-700"
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
