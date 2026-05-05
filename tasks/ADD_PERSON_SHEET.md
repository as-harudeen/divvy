# Task: Add Person Bottom Sheet (Screen 02b)

## Overview

Bottom sheet for creating a new Person. First-name input only. Auto-assign avatar color via `hash(personId) mod 7` from curated palette. Writes to global people store; appears in Recents everywhere.

## Requirements

- [x] `@gorhom/bottom-sheet` based modal
- [x] First-name input (required, trimmed, ≤ 32 chars)
- [x] Avatar preview shows assigned color live
- [x] "Add" button disabled when name empty
- [x] On add: write Person to people store, return new person to caller, close sheet
- [x] Caller (Create Group screen) auto-adds returned person to current group form

## Technical Notes

| Item | Detail |
|---|---|
| Component | `components/people/AddPersonSheet.tsx` |
| Hash | simple `for (let i=0; i<id.length; i++) h = (h*31 + id.charCodeAt(i)) | 0` mod 7 |
| Palette | from `theme.ts` (Task 0.2) |
| Tests | component: validation, deterministic color, write hits store, sheet dismiss |

## TDD Checklist

- [x] Add button disabled when name empty / whitespace
- [x] Color deterministic: same id → same palette index
- [x] Successful add appends to `usePeopleStore`
- [x] Sheet closes on add and on backdrop tap
- [x] Implement
- [x] `pnpm turbo typecheck` clean

## Completed

- Implemented Add Person as a `@gorhom/bottom-sheet` modal with first-name validation, deterministic id-based avatar color, optional swatch override, store write, dismissal, and Create Group auto-add integration.
