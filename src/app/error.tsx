'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("UI Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Something went wrong!</h2>
        <p className="text-stone-600 mb-8">
          We encountered an unexpected error while loading this page. 
          {error.digest && <span className="block mt-2 text-xs font-mono text-stone-400">Error ID: {error.digest}</span>}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/"
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium py-3 px-4 rounded-lg transition-colors border border-stone-200 block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
