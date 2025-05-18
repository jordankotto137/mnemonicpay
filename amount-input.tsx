'use client';

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  error?: string;
}

const AmountInput = ({
  value,
  onChange,
  min = 1,
  max = 10000,
  className,
  error
}: AmountInputProps) => {
  const [displayValue, setDisplayValue] = React.useState<string>(value.toString());
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(inputValue);
    
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };
  
  const handleBlur = () => {
    // Format on blur
    const numericValue = parseFloat(displayValue);
    if (!isNaN(numericValue)) {
      // Ensure value is within min/max range
      const boundedValue = Math.min(Math.max(numericValue, min), max);
      onChange(boundedValue);
      setDisplayValue(boundedValue.toString());
    } else {
      // Reset to min value if invalid
      onChange(min);
      setDisplayValue(min.toString());
    }
  };
  
  const incrementAmount = () => {
    const newValue = Math.min(value + 5, max);
    onChange(newValue);
    setDisplayValue(newValue.toString());
  };
  
  const decrementAmount = () => {
    const newValue = Math.max(value - 5, min);
    onChange(newValue);
    setDisplayValue(newValue.toString());
  };
  
  return (
    <div className={cn('w-full', className)}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Amount
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-amber-500 focus:ring-amber-500 sm:text-sm",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
          placeholder="0.00"
          aria-describedby="amount-currency"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <div className="flex h-full divide-x divide-gray-200">
            <button
              type="button"
              onClick={decrementAmount}
              className="flex items-center justify-center rounded-none rounded-l-md border border-transparent px-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span className="sr-only">Decrease</span>
              <span className="text-lg">−</span>
            </button>
            <button
              type="button"
              onClick={incrementAmount}
              className="flex items-center justify-center rounded-none rounded-r-md border border-transparent px-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span className="sr-only">Increase</span>
              <span className="text-lg">+</span>
            </button>
          </div>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <p className="mt-2 text-sm text-gray-500">
        {formatCurrency(value)} will be available for redemption
      </p>
    </div>
  );
};

export { AmountInput };
