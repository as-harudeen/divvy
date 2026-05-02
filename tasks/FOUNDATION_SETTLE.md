# Task: Foundation — Settlement algorithm

## Overview

Min-transactions settlement. Pure function, no React, no storage. Given splits in a group, return list of transfers `{from, to, cents}` that zero everyone out. Build this **before any UI** — if math wrong, app wrong.

## Requirements

- [x] `lib/settle.ts` exports:
  - `computeNetBalances(splits: Split[]): Record<PersonId, number>` — sum of `(paid by them) - (their share)` across splits
  - `settle(balances: Record<PersonId, number>): Transfer[]` — greedy: pair largest creditor with largest debtor, transfer `min(|c|, |d|)`, drop zeros, repeat
- [x] Pure functions, no side effects
- [x] All math in integer cents
- [x] Returns empty array when all balanced
- [x] Stable ordering (deterministic for same input)

## Technical Notes

| Item | Detail |
|---|---|
| File | `apps/mobile/src/lib/settle.ts` |
| Tests | `tests/settle.test.ts` — most important file in repo |
| Types | `Split`, `Transfer`, `PersonId` from `@repo/types` |

## TDD Checklist (≥ 8 scenarios)

- [x] 2 people, A paid $20 for both → B owes A $10
- [x] 4 people, equal $40 bill, A paid → 3 transfers of $10 to A
- [x] 4 people, one over-payer (A paid $100 for $80 bill split equally)
- [x] 4 people, two payers different amounts (A paid $30, B paid $50, $80 split equally)
- [x] All balanced (everyone paid own share) → 0 transfers
- [x] Odd cents total ($10.01 / 3) — settles cleanly
- [x] One person owes multiple creditors
- [x] Person paid but excluded from share
- [x] `pnpm turbo typecheck` clean
- [x] Biome clean

## Completed

- Added shared `PersonId`, `Split`, and `Transfer` types in `@repo/types`.
- Implemented pure settlement math in `apps/mobile/src/lib/settle.ts`.
- Added 10 settlement tests in `apps/mobile/tests/settle.test.ts`.
- Verified with targeted settlement tests, `pnpm turbo test`, `pnpm turbo typecheck`, and `pnpm lint`.
