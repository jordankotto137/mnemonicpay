'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShareLinkProps {
  shareUrl: string;
  className?: string;
}

const ShareLink = ({ shareUrl, className }: ShareLinkProps) => {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className={cn(
      'flex flex-col space-y-2 w-full',
      className
    )}>
      <label className="block text-sm font-medium text-gray-700">
        Share Link
      </label>
      <div className="flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-amber-500 focus:ring-amber-500 sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white hover:from-amber-600 hover:to-orange-700 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {copied ? (
            <>
              <span className="text-sm">Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span className="text-sm">Copy</span>
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Share this link with the recipient or write down the mnemonic phrase for them
      </p>
    </div>
  );
};

export { ShareLink };
