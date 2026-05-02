// biome-ignore lint/performance/noBarrelFile: package-entry barrel required for @repo/ui consumers
export { Button } from './components/button';
export type { ButtonProps } from './components/button';

export { Pill } from './components/pill';
export type { PillProps } from './components/pill';

export { Avatar, avatarColorForId } from './components/avatar';
export type { AvatarProps } from './components/avatar';

export { Card } from './components/card';
export type { CardProps } from './components/card';

export { NumPad } from './components/numpad';
export type { NumPadProps } from './components/numpad';

export { BottomSheetTrigger } from './components/bottom-sheet-trigger';
export type { BottomSheetTriggerProps } from './components/bottom-sheet-trigger';

export {
  COLORS,
  AVATAR_PALETTE,
  SPACING,
  RADII,
  TYPE_SCALE,
} from './theme';
export type {
  ThemeColors,
  AvatarPalette,
  ThemeSpacing,
  ThemeRadii,
  ThemeTypeScale,
} from './theme';
