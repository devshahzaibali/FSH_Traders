'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-base py-2 px-3 rounded transition ${className}`}
      aria-label="Go back"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
};

export default BackButton; 