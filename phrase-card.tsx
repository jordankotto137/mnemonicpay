'use client';

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';

interface PhraseCardProps {
  phrase: string;
  amount: number;
  status: 'unredeemed' | 'redeemed';
  createdAt: Date | string;
  className?: string;
  onShare?: () => void;
}

const PhraseCard = ({
  phrase,
  amount,
  status,
  createdAt,
  className,
  onShare
}: PhraseCardProps) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const statusColors = {
    unredeemed: 'bg-green-100 text-green-800',
    redeemed: 'bg-gray-100 text-gray-800'
  };
  
  return (
    <div className={cn(
      'rounded-lg border border-amber-200 bg-white shadow-sm hover:shadow-md transition-shadow',
      status === 'redeemed' && 'opacity-75',
      className
    )}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {phrase}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Created on {formattedDate}
            </p>
          </div>
          <span className={cn(
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusColors[status]
          )}>
            {status === 'unredeemed' ? 'Available' : 'Redeemed'}
          </span>
        </div>
        
        <div className="mt-4 flex items-baseline">
          <span className="text-2xl font-bold text-amber-600">
            {formatCurrency(amount)}
          </span>
        </div>
        
        {status === 'unredeemed' && onShare && (
          <div className="mt-4">
            <button
              onClick={onShare}
              className="inline-flex items-center justify-center w-full rounded-md border border-transparent bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { PhraseCard };
