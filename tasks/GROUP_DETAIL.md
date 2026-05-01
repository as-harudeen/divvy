# Task: Group Detail (Screen 03)

## Overview

Group home page. Member row (avatars), balance card showing user's net across all splits in this group, splits feed sorted newest first, FAB → new split. Status pill at top reflects open/settled.

## Requirements

- [ ] Header: group name, edit affordance (defer impl), status pill
- [ ] Member row: stacked avatars + count
- [ ] Balance card: "You owe $X" / "You're owed $X" / "Settled" — derived via `computeNetBalances` filtered to `userPersonId`
- [ ] Splits feed: list of splits in this group, each row shows label, total, payer, settlement state
- [ ] Tap split row → `/group/[id]/split/[splitId]/detail`
- [ ] FAB → `/group/[id]/split/new`
- [ ] Empty splits state: "No splits yet" + CTA
- [ ] `recomputeStatus(groupId)` runs on splits change

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/index.tsx` |
| Components | `components/groups/GroupHeader.tsx`, `components/splits/SplitRow.tsx`, `components/splits/BalanceCard.tsx` |
| Data | `useGroupsStore`, `useSplitsStore.selectByGroup(id)`, `useAppStore.userPersonId` |
| Math | `lib/settle.ts::computeNetBalances` |
| Tests | component: balance updates on split add; empty state; status pill flip |

## TDD Checklist

- [ ] Balance card shows correct value when user is creditor / debtor / balanced
- [ ] Empty splits state when feed empty
- [ ] Adding a split via mock store updates balance + status
- [ ] FAB nav
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
