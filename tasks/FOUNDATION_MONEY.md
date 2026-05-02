# Task: Foundation — Money library

## Overview

All monetary values stored as integer cents. Floats forbidden outside display formatters. Single most important defensive primitive in the app.

## Requirements

- [x] `lib/money.ts` exports:
  - `toCents(dollars: number | string): number`
  - `fromCents(cents: number): number` (for display only)
  - `formatCents(cents: number, locale?: string, currency?: string): string` via `Intl.NumberFormat`
  - `equalSplit(totalCents: number, n: number): number[]` — deterministic remainder distribution: first `remainder` people get `base + 1`, rest get `base`
  - `sumCents(values: number[]): number`
- [x] All inputs/outputs are integers; throws on non-integer cents
- [x] No `*` or `/` on `*Amount` / `*Total` / `*Cents` outside this file (lint guard)

## Technical Notes

| Item | Detail |
|---|---|
| File | `apps/mobile/src/lib/money.ts` (or shared in `packages/utils`) |
| Tests | `tests/money.test.ts` |
| Locale | default `en-US`, USD; format-only — storage stays integer cents |

## TDD Checklist

- [x] `equalSplit(1000, 3)` → `[334, 333, 333]`
- [x] `equalSplit(1, 3)` → `[1, 0, 0]`
- [x] `equalSplit(10000, 4)` → `[2500, 2500, 2500, 2500]`
- [x] `equalSplit(0, 5)` → `[0,0,0,0,0]`
- [x] `equalSplit(100, 1)` → `[100]`
- [x] `formatCents(9640)` → `"$96.40"`
- [x] `formatCents(0)` → `"$0.00"`
- [x] `sumCents([334,333,333])` === `1000`
- [x] Throws on non-integer input
- [x] `pnpm turbo typecheck` clean

## Completed

- Placed in `packages/utils/src/money.ts` (shared utility package per architecture)
- All 5 exports implemented: toCents, fromCents, formatCents, equalSplit, sumCents
- 26 money tests passing in `packages/utils/src/money.test.ts`
- Strict cent parsing rejects malformed strings, fractional cents, unsafe integers, and negative entered amounts
- Integer validation with TypeError on non-integer inputs; RangeError on negative split totals and invalid participant counts
- `scripts/check-money-math.js` enforces no raw `*` or `/` on `*Amount` / `*Total` / `*Cents` outside `packages/utils/src/money.ts`
- Root `pnpm lint` runs the money math guard after `turbo lint`
- `pnpm turbo typecheck` clean; biome check clean (pre-existing barrel warning only)
