'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MnemonicDisplayProps {
  phrase: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const MnemonicDisplay = ({
  phrase,
  className,
  size = 'md',
  animated = false,
}: MnemonicDisplayProps) => {
  const words = phrase.split(' ');
  
  const sizes = {
    sm: 'text-sm p-2 gap-2',
    md: 'text-base p-3 gap-3',
    lg: 'text-lg p-4 gap-4',
  };
  
  return (
    <div className={cn(
      'flex flex-col items-center justify-center rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200',
      sizes[size],
      className
    )}>
      <div className="flex flex-wrap justify-center gap-2">
        {words.map((word, index) => (
          <div 
            key={index}
            className={cn(
              'bg-white rounded-md border border-amber-300 px-3 py-2 font-mono shadow-sm',
              animated && 'animate-fadeIn',
              animated && `animation-delay-${index * 200}`
            )}
          >
            <span className="text-amber-800 mr-1 opacity-70">{index + 1}.</span>
            <span className="font-semibold text-gray-900">{word}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Write down these words and keep them safe
      </p>
    </div>
  );
};

export { MnemonicDisplay };
