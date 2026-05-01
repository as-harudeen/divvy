# Task: Foundation — Toolchain

## Overview

Bootstrap dev environment. Verify Expo app boots on iOS simulator AND a real Android device on day 1. Add core deps for state, gestures, animation, icons, haptics, IDs, bottom sheets.

## Requirements

- [ ] App builds + launches on iOS simulator
- [ ] App builds + launches on real Android device (not just emulator)
- [ ] Add deps: `zustand`, `nanoid`, `lucide-react-native`, `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`, `expo-font`, `@gorhom/bottom-sheet`
- [ ] Configure `react-native-reanimated/plugin` in `babel.config.js`
- [ ] Wrap root layout in `GestureHandlerRootView`
- [ ] `pnpm turbo typecheck` clean
- [ ] `pnpm biome check .` clean

## Technical Notes

| Item | Detail |
|---|---|
| Workspace | `apps/mobile` |
| Files touched | `package.json`, `babel.config.js`, `app/_layout.tsx` |
| State management | Zustand (added; wired in 0.6) |
| Tests to write first | smoke render of root layout |

## TDD Checklist

- [x] Smoke test: root layout renders without crash
- [ ] Implement deps + babel plugin
- [ ] `pnpm turbo typecheck` — no errors
- [ ] `pnpm turbo lint` — no issues
- [ ] All tests green

## Completed

<!-- fill after task done -->
