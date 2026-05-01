# Task: Polish — Locale-safe currency display

## Overview

Even shipping USD-only, format every dollar via `Intl.NumberFormat`. Hardcoded `"$"` template literals are technical debt and break the day someone wants GBP.

## Requirements

- [ ] All currency display goes through `formatCents` (Task 0.3)
- [ ] No bare `` `$${...}` `` template literals in components — biome lint rule
- [ ] Default locale `en-US`, currency `USD`, configurable via `lib/locale.ts`
- [ ] `formatCents` accepts optional `locale` + `currency` overrides

## Technical Notes

| Item | Detail |
|---|---|
| Files | `apps/mobile/src/lib/money.ts`, `apps/mobile/src/lib/locale.ts` |
| Lint | biome rule banning `\\$\\$` regex in JSX strings; or grep guard in CI |
| Tests | unit: format USD vs EUR (sanity); component grep for `$` literals returns 0 hits in `components/` |

## TDD Checklist

- [ ] `formatCents(9640, 'en-US', 'USD')` → `"$96.40"`
- [ ] `formatCents(9640, 'de-DE', 'EUR')` → euro-formatted
- [ ] CI grep for `` `\\$\\$` `` in `components/` returns 0
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
