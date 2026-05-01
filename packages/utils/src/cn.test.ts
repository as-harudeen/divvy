import { cn } from './cn';

/**
 * TDD example: tests written first, then cn() was implemented to satisfy them.
 *
 * These tests document the expected behaviour as a living contract.
 */
describe('cn()', () => {
  it('returns an empty string with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('merges simple class strings', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1');
  });

  it('filters out falsy values', () => {
    expect(cn('px-2', false, null, undefined, '')).toBe('px-2');
  });

  it('resolves Tailwind conflicts — last value wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');
  });

  it('handles object syntax from clsx', () => {
    expect(cn({ 'font-bold': true, 'text-sm': false })).toBe('font-bold');
  });

  it('merges complex conflicting Tailwind utilities', () => {
    expect(cn('text-red-500 p-4', 'text-blue-500')).toBe('p-4 text-blue-500');
  });
});
