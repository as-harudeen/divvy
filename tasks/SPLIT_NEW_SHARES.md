# Task: Split New — Per-person share rows + balance banner (Screen 04 part 2)

## Overview

Bottom half of split creation. One `ShareRow` per group member. Live recompute every keystroke. Long-press to exclude (greys out, share = 0, removed from `equalSplit` pool). Balance banner shows Remaining / Over by / Balanced with color states. Save enabled only when balanced.

## Requirements

- [ ] `ShareRow` per member: avatar, name, amount (formatted), excluded indicator
- [ ] Long-press toggles `excluded` flag → share set to 0, removed from auto-distribution pool
- [ ] On `mode === 'equally'` and any include/exclude change: re-run `equalSplit(totalCents, includedCount)` and assign back
- [ ] Balance banner states:
  - `sum(shares) === totalCents` → "Balanced" (green)
  - `sum(shares) < totalCents` → "Remaining $X.XX" (neutral)
  - `sum(shares) > totalCents` → "Over by $X.XX" (red)
- [ ] Save button enabled only when balanced AND `totalCents > 0` AND label set AND payer set
- [ ] On save: `useSplitsStore.createSplit(...)`, navigate back to group detail

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | same as 2.2 (`app/group/[id]/split/new.tsx`) |
| Components | `components/splits/ShareRow.tsx`, `components/splits/BalanceBanner.tsx` |
| State | continues `splitDraftReducer` from Task 2.2 |
| Tests | component: long-press exclude; banner state machine; equally re-distribution after exclude; save gate |

## TDD Checklist

- [ ] Excluding 1 of 4 members re-distributes total across remaining 3 via `equalSplit`
- [ ] Banner reflects "Remaining" / "Over by" / "Balanced" correctly
- [ ] Save disabled when over/under
- [ ] Excluded row grey + share === 0
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
