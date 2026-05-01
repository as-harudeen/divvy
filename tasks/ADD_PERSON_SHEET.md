# Task: Add Person Bottom Sheet (Screen 02b)

## Overview

Bottom sheet for creating a new Person. First-name input only. Auto-assign avatar color via `hash(personId) mod 7` from curated palette. Writes to global people store; appears in Recents everywhere.

## Requirements

- [ ] `@gorhom/bottom-sheet` based modal
- [ ] First-name input (required, trimmed, ≤ 32 chars)
- [ ] Avatar preview shows assigned color live
- [ ] "Add" button disabled when name empty
- [ ] On add: write Person to people store, return new person to caller, close sheet
- [ ] Caller (Create Group screen) auto-adds returned person to current group form

## Technical Notes

| Item | Detail |
|---|---|
| Component | `components/people/AddPersonSheet.tsx` |
| Hash | simple `for (let i=0; i<id.length; i++) h = (h*31 + id.charCodeAt(i)) | 0` mod 7 |
| Palette | from `theme.ts` (Task 0.2) |
| Tests | component: validation, deterministic color, write hits store, sheet dismiss |

## TDD Checklist

- [ ] Add button disabled when name empty / whitespace
- [ ] Color deterministic: same id → same palette index
- [ ] Successful add appends to `usePeopleStore`
- [ ] Sheet closes on add and on backdrop tap
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
