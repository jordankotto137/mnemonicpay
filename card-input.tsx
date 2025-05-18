'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface CardInputProps {
  onChange: (data: {
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    name: string;
  }) => void;
  className?: string;
  errors?: {
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    name?: string;
  };
}

const CardInput = ({ onChange, className, errors = {} }: CardInputProps) => {
  const [cardData, setCardData] = React.useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    name: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      // Add spaces after every 4 digits
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    
    // Format expiry date as MM/YY
    if (field === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    // Format CVC as numbers only
    if (field === 'cvc') {
      value = value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
    }
    
    const newData = { ...cardData, [field]: value };
    setCardData(newData);
    onChange(newData);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
          Name on card
        </label>
        <input
          type="text"
          id="card-name"
          value={cardData.name}
          onChange={handleChange('name')}
          className={cn(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm",
            errors.name && "border-red-300 focus:border-red-500 focus:ring-red-500"
          )}
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
          Card number
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            id="card-number"
            value={cardData.cardNumber}
            onChange={handleChange('cardNumber')}
            className={cn(
              "block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm",
              errors.cardNumber && "border-red-300 focus:border-red-500 focus:ring-red-500"
            )}
            placeholder="1234 5678 9012 3456"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
            Expiry date
          </label>
          <input
            type="text"
            id="expiry-date"
            value={cardData.expiryDate}
            onChange={handleChange('expiryDate')}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm",
              errors.expiryDate && "border-red-300 focus:border-red-500 focus:ring-red-500"
            )}
            placeholder="MM/YY"
          />
          {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
        </div>
        
        <div>
          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            value={cardData.cvc}
            onChange={handleChange('cvc')}
            className={cn(
              "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm",
              errors.cvc && "border-red-300 focus:border-red-500 focus:ring-red-500"
            )}
            placeholder="123"
          />
          {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
        </div>
      </div>
      
      <div className="mt-1">
        <p className="text-xs text-gray-500">
          Your card information is securely processed by Stripe. We never store your full card details.
        </p>
      </div>
    </div>
  );
};

export { CardInput };
