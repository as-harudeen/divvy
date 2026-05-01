# Task: Settlement screen (Screen 05)

## Overview

Render `settle.ts` transfers as "X pays Y $Z" rows. Tap row → mark paid (writes `paidAt`). When all transfers in a group's splits are paid, group `status` flips to `settled`.

## Requirements

- [ ] Compute group net balances → `settle()` → list of transfers
- [ ] Cache settlement on Split write (avoid recompute every render)
- [ ] `TransferRow`: from-avatar → to-avatar, amount, paid checkmark
- [ ] Tap row → toggle `paidAt` (set to now or undefined)
- [ ] Header summary: "N transfers · $X total"
- [ ] When all transfers paid: badge "Settled", group status updates
- [ ] Empty state: "Already settled" when 0 transfers

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/split/[splitId]/settle.tsx` (also a group-level variant if needed) |
| Components | `components/splits/TransferRow.tsx` |
| Data | `useSplitsStore.markTransferPaid(splitId, transferIdx)`; `recomputeStatus(groupId)` after |
| Math | `lib/settle.ts` |
| Tests | component: tap toggles paid; group status flips when all paid; zero-transfer empty state |

## TDD Checklist

- [ ] Renders one row per transfer
- [ ] Tap toggles `paidAt`
- [ ] Group status === `settled` when all transfers paid
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
