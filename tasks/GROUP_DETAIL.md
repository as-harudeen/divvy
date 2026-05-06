# Task: Group Detail (Screen 03)

## Overview

Group home page / persistent ledger. Group name in the nav bar, member row with avatars and an add slot, balance card showing user's net across all splits in this group, splits feed sorted newest first, bottom CTA -> new split. Split rows carry open/settled state.

## Requirements

- [x] Header: back to groups, group name, `Edit` affordance for rename / add / remove members
- [x] Member row: avatars with labels + `Add` slot
- [x] Tap member avatar -> filter the balance context to that member
- [x] Balance card: "You owe $X" / "You are owed $X" / "Settled" - derived via `computeNetBalances` filtered to `userPersonId`
- [x] Balance card recolors red if current user owes net
- [x] Splits feed: list of splits in this group, each row shows label, time, total, and settled/open status mark
- [x] Green = settled and amber = open, matched on icon and color
- [x] Tap split row -> `/group/[id]/split/[splitId]/settle` for review/edit
- [x] Bottom `+ New split` CTA -> `/group/[id]/split/new`
- [x] Empty splits state: "Add your first split"
- [x] `recomputeStatus(groupId)` runs on splits change

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/index.tsx` |
| Components | `components/groups/GroupHeader.tsx`, `components/splits/SplitRow.tsx`, `components/splits/BalanceCard.tsx` |
| Data | `useGroupsStore`, `useSplitsStore.selectByGroup(id)`, `useAppStore.userPersonId` |
| Math | `lib/settle.ts::computeNetBalances` |
| Tests | component: balance updates on split add; empty state; member filter; split status icons/colors; row/CTA nav |

## TDD Checklist

- [x] Balance card shows correct value when user is creditor / debtor / balanced
- [x] Balance card uses red treatment when user owes net
- [x] Member tap filters balance context
- [x] Empty splits state says "Add your first split"
- [x] Split rows show settled/open icon and color
- [x] Adding a split via mock store updates balance + status
- [x] Split row navigates to settlement screen
- [x] Bottom `+ New split` CTA nav
- [x] `pnpm turbo typecheck` clean

## Completed

- Implemented Group Detail screen, task components, and focused component coverage.
