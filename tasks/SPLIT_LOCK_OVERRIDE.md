# Task: Split New — Lock-on-edit override

## Overview

Subtle interaction. Tap a person's amount field → enter custom value → that row locks (amber border) and is excluded from auto-redivide. Remainder splits across unlocked + included rows. All-locked → banner reflects diff vs total.

## Requirements

- [ ] Tap amount on a `ShareRow` → numeric editor (small inline pad or keyboard)
- [ ] On commit of custom value: row gains `locked: true`, amber border
- [ ] Auto-redistribute: `remaining = totalCents - sum(lockedShares)`; pool = `members - excluded - locked`; `equalSplit(remaining, pool.size)` → assign
- [ ] Locked row stays at user-set value through total changes (until unlocked)
- [ ] Unlock affordance (tap the lock icon) returns row to auto pool
- [ ] If `sum(lockedShares) > totalCents`: pool gets 0; banner "Over by $X"
- [ ] Mode toggle to `custom` → all rows lock with current values; toggle to `equally` → all unlock + re-equal-split

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | same as 2.2/2.3 |
| Reducer actions | `LOCK_SHARE`, `UNLOCK_SHARE`, `SET_LOCKED_VALUE` |
| Tests | unit reducer: 4 people → lock 2 → unlocked 2 share remainder via `equalSplit`; over-locked → 0 to pool, banner "Over by" |

## TDD Checklist

- [ ] Lock 1 of 4 ($10 of $40 total) → other 3 each get `equalSplit($30, 3)`
- [ ] Lock 2 of 4 ($10 + $15 of $40) → other 2 each get `equalSplit($15, 2)`
- [ ] Lock 4 of 4 with sum > total → banner "Over by"
- [ ] Lock 4 of 4 with sum === total → banner "Balanced", save enabled
- [ ] Unlock returns row to pool, recomputes
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
