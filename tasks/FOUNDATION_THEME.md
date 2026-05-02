# Task: Foundation — Theme & Design Tokens

## Overview

Lock visual language before any screen built. Extract tokens from mockups: colors, spacing, radii, type scale. Load Inter (UI) + JetBrains Mono (numbers) via `expo-font`. Build `/design` debug route to eyeball every primitive.

## Requirements

- [x] `theme.ts` (in `packages/ui` or `apps/mobile/src/theme`): colors, spacing scale, radii, type scale
- [x] Curated 7-color avatar palette (used by `hash(personId) mod 7` later)
- [x] Inter loaded (Regular, Medium, SemiBold, Bold)
- [x] JetBrains Mono loaded (Regular, Medium) for numeric displays
- [x] `app/_design.tsx` debug route renders: Button (variants), Pill, Avatar (all 7 colors), Card, NumPad, BottomSheet trigger
- [x] NativeWind config (if used) consumes tokens

## Technical Notes

| Item | Detail |
|---|---|
| Theme location | `packages/ui/src/theme.ts` exported via `@repo/ui` |
| Fonts | `apps/mobile/assets/fonts/`, loaded in `app/_layout.tsx` via `useFonts` |
| Debug route | `app/_design.tsx` — exclude from prod via `__DEV__` guard |
| Tests | snapshot per primitive |

## TDD Checklist

- [x] Snapshot tests for each primitive variant
- [x] Font load test does not crash
- [x] Implement tokens + primitives
- [x] `pnpm turbo typecheck` clean
- [x] Biome clean

## Completed

- `packages/ui/src/theme.ts` — COLORS, AVATAR_PALETTE (7 curated colors), SPACING, RADII, TYPE_SCALE
- `packages/ui/src/components/pill.tsx` — Pill component (default, success, warning, destructive, info variants)
- `packages/ui/src/components/avatar.tsx` — Avatar + avatarColorForId() (deterministic palette via hash mod 7)
- `packages/ui/src/components/card.tsx` — Card (flat, elevated, outlined variants)
- `packages/ui/src/components/numpad.tsx` — NumPad (0-9 + backspace)
- `packages/ui/src/components/bottom-sheet-trigger.tsx` — BottomSheetTrigger using @gorhom/bottom-sheet
- `apps/mobile/app/_layout.tsx` — Inter (4 weights) + JetBrains Mono (2 weights) loaded
- `apps/mobile/app/_design.tsx` — Debug route with __DEV__ guard, shows all primitives
- Both tailwind configs extended with theme tokens (colors, radii, spacing, font families)
- 79 tests passing across monorepo (49 @repo/ui + 23 mobile + 7 @repo/utils)