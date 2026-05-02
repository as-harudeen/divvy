const { COLORS, RADII, SPACING } = require('../../packages/ui/src/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: COLORS.primary,
        'primary-light': COLORS.primaryLight,
        'primary-dark': COLORS.primaryDark,
        destructive: COLORS.destructive,
        'destructive-light': COLORS.destructiveLight,
        success: COLORS.success,
        'success-light': COLORS.successLight,
        warning: COLORS.warning,
        'warning-light': COLORS.warningLight,
        neutral: Object.fromEntries(COLORS.neutral.map((c, i) => [i, c])),
      },
      borderRadius: {
        sm: RADII.sm,
        md: RADII.md,
        lg: RADII.lg,
        xl: RADII.xl,
      },
      spacing: SPACING,
      fontFamily: {
        'inter-bold': ['InterBold'],
        'inter-semibold': ['InterSemiBold'],
        'inter-medium': ['InterMedium'],
        'inter-regular': ['InterRegular'],
        'mono-medium': ['JetBrainsMonoMedium'],
        'mono-regular': ['JetBrainsMonoRegular'],
      },
    },
  },
  plugins: [],
};
