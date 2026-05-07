# Task: Group Detail — Add People Sheet (Screen 03b)

## Overview

Multi-select bottom sheet opened from Group Detail's `+ Add` member slot (or `Edit` action). User browses people from all their groups, selects one or more, and adds them in bulk. Unified search field filters existing people and creates new ones inline — no separate modal. Sheet is Group Detail-owned, not a routed screen.

## Requirements

- [x] `@gorhom/bottom-sheet` modal with grabber, rounded top corners, dark scrim over Group Detail
- [x] Sticky header row: `Cancel` (left) · `Add people` title (center) · `Add (n)` (right)
- [x] `Add (n)` muted when no selection; brand blue + count once ≥ 1 selected
- [x] Selected-pill strip (horizontal scroll, `MemberPill`) pinned below header
- [x] Unified `BottomSheetTextInput` — placeholder `Search or type a new name`
- [x] People list section header `FROM YOUR GROUPS` with `N people` count on right
- [x] Pool = all people across all groups, de-duplicated, sorted by most-recent `lastActivityAt`
- [x] Each row: avatar initial, name, last-seen context (`GroupName · Xd ago` derived from most-recent group `lastActivityAt`)
- [x] Tap selectable row → toggle in selection; blue-tinted bg + filled checkbox when selected
- [x] People already in the current group: visible but locked — dimmed + `In group` tag, not tappable
- [x] Keyboard-up (create) state: sheet shrinks, header/pills/search stay pinned above content
- [x] `CREATE NEW` section at top of results when query is non-empty and no exact match (case-insensitive, trimmed)
  - Row: brand-blue circular plus · `Create "X"` title · `New person - added to this group` subcopy · `Add →`
  - Exact match → create row disappears
- [x] `MATCHES` section: live-filter existing-person rows; highlight matching prefix in name
- [x] Inline create: `usePeopleStore.addPerson`, auto color via `paletteColorForId(nanoid())`, then auto-select + pill appears, search field clears
- [x] `Add (n)` tap: call `useGroupsStore.addMember(groupId, personId)` for each selected person, then dismiss
- [x] `Cancel` / swipe-down: dismiss without writing changes
- [x] Wire `+ Add` member slot in `app/group/[id]/index.tsx` to open this sheet
- [x] Wire `Edit` action in `app/group/[id]/index.tsx` to open this sheet

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/index.tsx` (entry point; sheet is not a route) |
| New component | `components/groups/AddPeopleSheet.tsx` |
| Reuse | `MemberPill` (selected strip), `paletteColorForId` (extract from `AddPersonSheet.tsx` or duplicate inline) |
| Data — pool | `usePeopleStore` → all people; `useGroupsStore` → all groups for last-seen derivation |
| Data — write | `useGroupsStore.addMember(groupId, personId)` per selected person; `usePeopleStore.addPerson` for inline create |
| Last-seen | For each person, find all groups containing their id, pick max `lastActivityAt`, render `GroupName · Xd ago` |
| Avatar color | `paletteColorForId(nanoid())` — same deterministic hash as existing `AddPersonSheet` |
| Bottom sheet | `@gorhom/bottom-sheet` — `BottomSheetModal`, `BottomSheetTextInput`, `BottomSheetFlatList` |
| Tests | `apps/mobile/tests/group-detail-add-person.test.tsx` |

## TDD Checklist

- [x] `Add (n)` disabled / muted when selection empty
- [x] `Add (n)` shows correct count and turns blue on first selection
- [x] Selecting a row adds pill to strip; deselecting (via pill remove) updates count
- [x] People already in group show `In group` tag and cannot be selected
- [x] Search filters list live (case-insensitive)
- [x] `CREATE NEW` row appears when query non-empty and no exact match
- [x] `CREATE NEW` row disappears on exact match
- [x] Inline create: `usePeopleStore.addPerson` called, person auto-selected, search clears
- [x] `Add (n)` confirm: `useGroupsStore.addMember` called once per selected person
- [x] `Cancel` dismisses without calling `addMember`
- [x] `pnpm turbo typecheck` clean
