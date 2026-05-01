import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 * Uses clsx for conditional logic and tailwind-merge for deduplication.
 *
 * Works for both web Tailwind and NativeWind class strings.
 *
 * @example
 * cn('px-2 py-1', condition && 'font-bold', 'px-4') // → 'py-1 font-bold px-4'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
