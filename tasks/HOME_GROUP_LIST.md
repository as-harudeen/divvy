# Task: Home — Group list (Screen 01)

## Overview

Landing screen. List of groups as cards, ACTIVE badge on the active one, status pill (open/settled), context strip "Splitting under <group>", FAB → create group. Empty state when no groups exist.

## Requirements

- [x] `GroupCard` component: name, member avatars (stacked), status pill, ACTIVE badge if `id === activeGroupId`
- [x] List sorted by `lastActivityAt` desc
- [x] Context strip at top showing active group name (links to group detail on tap)
- [x] FAB bottom-right → `router.push('/group/new')`
- [x] Empty state: "No groups yet" + CTA button → create
- [x] Tap card → set activeGroupId + navigate to `/group/[id]`
- [x] Match mockup pixel-for-pixel

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/index.tsx` |
| Components | `components/groups/GroupCard.tsx`, `components/primitives/Pill.tsx`, `components/primitives/AvatarStack.tsx` |
| Data | `useGroupsStore`, `usePeopleStore`, `useAppStore` |
| Tests | unit: GroupCard variants; component: empty state, FAB nav, active highlight |

## TDD Checklist

- [x] Snapshot per GroupCard state (active/inactive × open/settled)
- [x] Empty state renders when groups list empty
- [x] FAB tap navigates to `/group/new`
- [x] Implement
- [x] `pnpm turbo typecheck` clean
- [x] Biome clean

## Completed

- Claude design references: `docs/mockups/HOME_GROUP_LIST.md`
