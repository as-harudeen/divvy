# Task: Foundation — Expo Router skeleton

## Overview

Stub all 7 routes. Type-safe links. Confirm navigation forward + back works before any real screen content.

## Requirements

- [x] `app/_layout.tsx` — root stack, fonts loaded, `GestureHandlerRootView`, theme provider
- [x] `app/index.tsx` — Home (Screen 01) placeholder
- [x] `app/group/new.tsx` — Create group (Screen 02) placeholder
- [x] `app/group/[id]/index.tsx` — Group detail (Screen 03) placeholder
- [x] `app/group/[id]/split/new.tsx` — Split new (Screen 04) placeholder
- [x] `app/group/[id]/split/[splitId]/settle.tsx` — Settlement (Screen 05) placeholder
- [x] `app/group/[id]/split/[splitId]/detail.tsx` — Split detail (Screen 06) placeholder
- [x] Debug menu in `_design.tsx` linking to each route with sample params
- [x] All `Link` / `router.push` calls type-checked

## Technical Notes

| Item | Detail |
|---|---|
| Router | Expo Router v4, file-based |
| Type safety | `expo-router/types` — confirm route map generates |
| Params | `useLocalSearchParams<{ id: string; splitId?: string }>()` |

## TDD Checklist

- [x] Nav test: from each route, `router.back()` returns to parent
- [x] Type test: invalid route string fails compile
- [x] Implement stubs
- [x] `pnpm turbo typecheck` clean
- [x] Biome clean

## Completed

- All 7 route stubs implemented (Screens 01–06 + debug menu)
- Debug menu in `_design.tsx` linking to each route with sample params
- Nav tests: 12 tests (6 screens × 2 assertions each — heading render + router.back)
- Design screen tests: 7 tests (heading + 6 route links)
- Type test: `routes-types.ts` verifies invalid pathnames and missing params fail compile
- All `Link` / `router.push` calls type-checked via Expo Router v4 generated types
- `pnpm turbo typecheck` clean, Biome clean
