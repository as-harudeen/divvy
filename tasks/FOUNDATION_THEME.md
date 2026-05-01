# Task: Foundation — Theme & Design Tokens

## Overview

Lock visual language before any screen built. Extract tokens from mockups: colors, spacing, radii, type scale. Load Inter (UI) + JetBrains Mono (numbers) via `expo-font`. Build `/design` debug route to eyeball every primitive.

## Requirements

- [ ] `theme.ts` (in `packages/ui` or `apps/mobile/src/theme`): colors, spacing scale, radii, type scale
- [ ] Curated 7-color avatar palette (used by `hash(personId) mod 7` later)
- [ ] Inter loaded (Regular, Medium, SemiBold, Bold)
- [ ] JetBrains Mono loaded (Regular, Medium) for numeric displays
- [ ] `app/_design.tsx` debug route renders: Button (variants), Pill, Avatar (all 7 colors), Card, NumPad, BottomSheet trigger
- [ ] NativeWind config (if used) consumes tokens

## Technical Notes

| Item | Detail |
|---|---|
| Theme location | `packages/ui/src/theme.ts` exported via `@repo/ui` |
| Fonts | `apps/mobile/assets/fonts/`, loaded in `app/_layout.tsx` via `useFonts` |
| Debug route | `app/_design.tsx` — exclude from prod via `__DEV__` guard |
| Tests | snapshot per primitive |

## TDD Checklist

- [ ] Snapshot tests for each primitive variant
- [ ] Font load test does not crash
- [ ] Implement tokens + primitives
- [ ] `pnpm turbo typecheck` clean
- [ ] Biome clean

## Completed

<!-- fill after task done -->
