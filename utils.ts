import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomGradient(): string {
  // Bitcoin-themed gradients
  const gradients = [
    'from-amber-500 to-orange-600',
    'from-amber-400 to-orange-500',
    'from-yellow-400 to-orange-500',
    'from-yellow-500 to-amber-600',
    'from-orange-400 to-amber-600',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
}
