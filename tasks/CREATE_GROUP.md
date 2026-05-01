# Task: Create Group (Screen 02)

## Overview

Form to name a group + add members. Members shown as pills. Recents list pulls from global Person table. Already-added recents render dimmed. Member counter visible. Save → set activeGroupId, navigate to group detail.

## Requirements

- [ ] Group name input (required, trimmed)
- [ ] Member pills row showing currently added members (with remove × on each)
- [ ] Recents section listing all `Person` records not yet added; tap to add
- [ ] Already-added recents shown dimmed (not removable from this list)
- [ ] Member counter: "N members"
- [ ] "Add person" button → opens AddPersonSheet (Task 1.3)
- [ ] Save button disabled when name empty or 0 members
- [ ] On save: create Group, set as activeGroupId, `router.replace('/group/[id]')`

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/new.tsx` |
| Components | `components/groups/MemberPill.tsx`, `components/people/PersonRow.tsx` |
| State | local form state via React; commit via `useGroupsStore.createGroup` |
| Data | `usePeopleStore` (recents), `useAppStore` (set active) |
| Tests | component: add/remove member, counter updates, save disabled states, recents excludes added |

## TDD Checklist

- [ ] Save disabled until name + ≥1 member
- [ ] Adding from recents removes it from selectable list (dims)
- [ ] Removing pill returns person to recents
- [ ] Counter reflects member count
- [ ] Save creates Group + navigates
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
