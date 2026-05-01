# Task: Foundation — Expo Router skeleton

## Overview

Stub all 7 routes. Type-safe links. Confirm navigation forward + back works before any real screen content.

## Requirements

- [ ] `app/_layout.tsx` — root stack, fonts loaded, `GestureHandlerRootView`, theme provider
- [ ] `app/index.tsx` — Home (Screen 01) placeholder
- [ ] `app/group/new.tsx` — Create group (Screen 02) placeholder
- [ ] `app/group/[id]/index.tsx` — Group detail (Screen 03) placeholder
- [ ] `app/group/[id]/split/new.tsx` — Split new (Screen 04) placeholder
- [ ] `app/group/[id]/split/[splitId]/settle.tsx` — Settlement (Screen 05) placeholder
- [ ] `app/group/[id]/split/[splitId]/detail.tsx` — Split detail (Screen 06) placeholder
- [ ] Debug menu in `_design.tsx` linking to each route with sample params
- [ ] All `Link` / `router.push` calls type-checked

## Technical Notes

| Item | Detail |
|---|---|
| Router | Expo Router v4, file-based |
| Type safety | `expo-router/types` — confirm route map generates |
| Params | `useLocalSearchParams<{ id: string; splitId?: string }>()` |

## TDD Checklist

- [ ] Nav test: from each route, `router.back()` returns to parent
- [ ] Type test: invalid route string fails compile
- [ ] Implement stubs
- [ ] `pnpm turbo typecheck` clean
- [ ] Biome clean

## Completed

<!-- fill after task done -->
