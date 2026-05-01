# Task: Foundation — Toolchain

## Overview

Bootstrap dev environment. Verify Expo app boots on iOS simulator AND a real Android device on day 1. Add core deps for state, gestures, animation, icons, haptics, IDs, bottom sheets.

## Requirements

- [ ] App builds + launches on iOS simulator
- [ ] App builds + launches on real Android device (not just emulator)
- [x] Add deps: `zustand`, `nanoid`, `lucide-react-native`, `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `expo-font`, `@gorhom/bottom-sheet`
- [x] Configure `react-native-reanimated/plugin` in `babel.config.js`
- [x] Wrap root layout in `GestureHandlerRootView`
- [x] `pnpm turbo typecheck` clean
- [x] `pnpm biome check .` clean

## Technical Notes

| Item | Detail |
|---|---|
| Workspace | `apps/mobile` |
| Files touched | `package.json`, `babel.config.js`, `app/_layout.tsx` |
| State management | Zustand (added; wired in 0.6) |
| Tests to write first | smoke render of root layout |

## TDD Checklist

- [x] Smoke test: root layout renders without crash
- [x] Implement deps + babel plugin
- [x] `pnpm turbo typecheck` — no errors
- [x] `pnpm turbo lint` — no issues
- [x] All tests green

## Completed

<!-- fill after task done -->
