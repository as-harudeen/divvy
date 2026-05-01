# Task: Split Detail — Owner view (Screen 06)

## Overview

Read view of one split, owned by the user (the payer or someone with edit role). Header (label, total, payer avatar), per-person share list, list of outstanding slide-to-pay rows. Read-only fork via `role` flag — no multi-user in v1, but respect the flag (10-min change later).

## Requirements

- [ ] Header: label, big total in JetBrains Mono, payer avatar + name + "paid"
- [ ] Per-person share list: avatar, name, amount, paid/owed indicator
- [ ] Outstanding transfers: render `SlideToPayRow` for each unpaid (Task 3.3)
- [ ] `role: 'owner' | 'reader'` prop — `reader` hides slide rows, shows "Pending" badge instead
- [ ] Edit affordance for owner (defer impl — link only)
- [ ] Delete affordance for owner with confirm

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/split/[splitId]/detail.tsx` |
| Components | `components/splits/SplitHeader.tsx`, `components/splits/ShareListItem.tsx`, integrates `SlideToPayRow` (Task 3.3) |
| Data | `useSplitsStore`, `useAppStore.userPersonId`, `usePeopleStore` |
| Role derivation | v1: `userPersonId === split.payerId ? 'owner' : 'reader'` |
| Tests | component: reader hides slide rows; owner shows them; delete confirm flow |

## TDD Checklist

- [ ] Renders header + shares correctly
- [ ] `role: 'reader'` hides slide-to-pay rows
- [ ] `role: 'owner'` shows slide-to-pay rows for unpaid transfers
- [ ] Delete confirm prompts before destructive action
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
