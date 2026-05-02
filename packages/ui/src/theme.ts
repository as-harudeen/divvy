export const COLORS = {
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  neutral: [
    '#F9FAFB',
    '#F3F4F6',
    '#E5E7EB',
    '#D1D5DB',
    '#9CA3AF',
    '#6B7280',
    '#4B5563',
    '#374151',
    '#1F2937',
    '#111827',
  ] as const,
  destructive: '#DC2626',
  destructiveLight: '#FEE2E2',
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
} as const;

export const AVATAR_PALETTE = [
  '#2563EB',
  '#DC2626',
  '#16A34A',
  '#9333EA',
  '#EA580C',
  '#0891B2',
  '#CA8A04',
] as const;

export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const RADII = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const TYPE_SCALE = {
  heading1: { className: 'text-3xl font-bold', fontFamily: 'InterBold' },
  heading2: { className: 'text-xl font-semibold', fontFamily: 'InterSemiBold' },
  body: { className: 'text-base', fontFamily: 'InterMedium' },
  small: { className: 'text-sm', fontFamily: 'InterMedium' },
  mono: { className: 'text-base font-medium', fontFamily: 'JetBrainsMonoMedium' },
} as const;

export type ThemeColors = typeof COLORS;
export type AvatarPalette = typeof AVATAR_PALETTE;
export type ThemeSpacing = typeof SPACING;
export type ThemeRadii = typeof RADII;
export type ThemeTypeScale = typeof TYPE_SCALE;
