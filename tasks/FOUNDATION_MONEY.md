# Task: Foundation — Money library

## Overview

All monetary values stored as integer cents. Floats forbidden outside display formatters. Single most important defensive primitive in the app.

## Requirements

- [ ] `lib/money.ts` exports:
  - `toCents(dollars: number | string): number`
  - `fromCents(cents: number): number` (for display only)
  - `formatCents(cents: number, locale?: string, currency?: string): string` via `Intl.NumberFormat`
  - `equalSplit(totalCents: number, n: number): number[]` — deterministic remainder distribution: first `remainder` people get `base + 1`, rest get `base`
  - `sumCents(values: number[]): number`
- [ ] All inputs/outputs are integers; throws on non-integer cents
- [ ] No `*` or `/` on `*Amount` / `*Total` / `*Cents` outside this file (lint guard)

## Technical Notes

| Item | Detail |
|---|---|
| File | `apps/mobile/src/lib/money.ts` (or shared in `packages/utils`) |
| Tests | `tests/money.test.ts` |
| Locale | default `en-US`, USD; format-only — storage stays integer cents |

## TDD Checklist

- [ ] `equalSplit(1000, 3)` → `[334, 333, 333]`
- [ ] `equalSplit(1, 3)` → `[1, 0, 0]`
- [ ] `equalSplit(10000, 4)` → `[2500, 2500, 2500, 2500]`
- [ ] `equalSplit(0, 5)` → `[0,0,0,0,0]`
- [ ] `equalSplit(100, 1)` → `[100]`
- [ ] `formatCents(9640)` → `"$96.40"`
- [ ] `formatCents(0)` → `"$0.00"`
- [ ] `sumCents([334,333,333])` === `1000`
- [ ] Throws on non-integer input
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
