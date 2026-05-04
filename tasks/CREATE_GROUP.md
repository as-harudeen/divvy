# Task: Create Group (Screen 02)

## Overview

Form to name a group + add members. Members shown as pills. Recents list pulls from global Person table. Already-added recents render dimmed. Member counter visible. Save → set activeGroupId, navigate to group detail.

## Requirements

- [x] Group name input (required, trimmed)
- [x] Member pills row showing currently added members (with remove × on each)
- [x] Recents section listing all `Person` records not yet added; tap to add
- [x] Already-added recents shown dimmed (not removable from this list)
- [x] Member counter: "N members"
- [x] "Add person" button → opens AddPersonSheet (Task 1.3)
- [x] Save button disabled when name empty or 0 members
- [x] On save: create Group, set as activeGroupId, `router.replace('/group/[id]')`

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/new.tsx` |
| Components | `components/groups/MemberPill.tsx`, `components/people/PersonRow.tsx` |
| State | local form state via React; commit via `useGroupsStore.createGroup` |
| Data | `usePeopleStore` (recents), `useAppStore` (set active) |
| Tests | component: add/remove member, counter updates, save disabled states, recents excludes added |

## TDD Checklist

- [x] Save disabled until name + ≥1 member
- [x] Adding from recents removes it from selectable list (dims)
- [x] Removing pill returns person to recents
- [x] Counter reflects member count
- [x] Save creates Group + navigates
- [x] Implement
- [x] `pnpm turbo typecheck` clean

## Completed

- Implemented on 2026-05-04 with component tests covering create-group form behavior.
