# Task: Home — Group list (Screen 01)

## Overview

Landing screen. List of groups as cards, ACTIVE badge on the active one, status pill (open/settled), context strip "Splitting under <group>", FAB → create group. Empty state when no groups exist.

## Requirements

- [ ] `GroupCard` component: name, member avatars (stacked), status pill, ACTIVE badge if `id === activeGroupId`
- [ ] List sorted by `lastActivityAt` desc
- [ ] Context strip at top showing active group name (links to group detail on tap)
- [ ] FAB bottom-right → `router.push('/group/new')`
- [ ] Empty state: "No groups yet" + CTA button → create
- [ ] Tap card → set activeGroupId + navigate to `/group/[id]`
- [ ] Match mockup pixel-for-pixel

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/index.tsx` |
| Components | `components/groups/GroupCard.tsx`, `components/primitives/Pill.tsx`, `components/primitives/AvatarStack.tsx` |
| Data | `useGroupsStore`, `usePeopleStore`, `useAppStore` |
| Tests | unit: GroupCard variants; component: empty state, FAB nav, active highlight |

## TDD Checklist

- [ ] Snapshot per GroupCard state (active/inactive × open/settled)
- [ ] Empty state renders when groups list empty
- [ ] FAB tap navigates to `/group/new`
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean
- [ ] Biome clean

## Completed

<!-- fill after task done -->
