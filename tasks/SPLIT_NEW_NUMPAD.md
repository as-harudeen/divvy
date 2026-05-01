# Task: Split New — Total entry, label, payer, mode toggle (Screen 04 part 1)

## Overview

Top half of split-creation screen. Big numeric total in JetBrains Mono driven by custom NumPad. Label input. Payer picker (defaults to user). Mode toggle: Equally / By share / Custom. State drives Task 2.3 (per-person rows).

## Requirements

- [ ] NumPad component (0-9, `.`, backspace) writing to `totalCents`
- [ ] Display total via `formatCents(totalCents)` in JetBrains Mono
- [ ] Label `TextInput` (≤ 64 chars)
- [ ] Payer picker — horizontal avatar list of group members; default to `userPersonId`
- [ ] Mode toggle segmented control: `equally | byShare | custom`
- [ ] Mode change recomputes shares from current `totalCents`:
  - `equally` → `equalSplit(totalCents, includedCount)` then drop into `shares`
  - `byShare` → equal start with editable share weights (impl in 2.3)
  - `custom` → blank; user fills (impl in 2.3)
- [ ] Cancel + Save (Save deferred until shares balance — see 2.3)

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | `app/group/[id]/split/new.tsx` |
| Components | `components/primitives/NumPad.tsx`, `components/splits/PayerPicker.tsx`, `components/primitives/SegmentedControl.tsx` |
| State | local React state via `useReducer` — single split-draft reducer file (`splitDraftReducer.ts`) |
| Math | `lib/money.ts::equalSplit` |
| Tests | unit: reducer transitions; component: NumPad input → display; mode toggle resets shares correctly |

## TDD Checklist

- [ ] NumPad: tapping `1`, `2`, `3`, `4` → `totalCents = 1234`
- [ ] Backspace decrements last digit
- [ ] Mode toggle from `equally` → `custom` clears overrides; back to `equally` re-derives
- [ ] Payer defaults to user
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
