# Task: Polish — Empty states

## Overview

Every list screen needs a deliberate empty state. Forgotten empty states are the #1 tell of an unfinished app in screenshots.

## Requirements

- [ ] Home: "No groups yet" + CTA "Create your first group"
- [ ] Group detail: "No splits yet" + CTA "Add a split"
- [ ] Recents (Add Person flow): "No people yet — add someone to get started"
- [ ] Settlement: "Already settled" when 0 transfers
- [ ] Each empty state matches design system: illustration/icon + title + body + CTA
- [ ] No raw "no items" text anywhere

## Technical Notes

| Item | Detail |
|---|---|
| Component | `components/primitives/EmptyState.tsx` (reusable: icon, title, body, CTA) |
| Icons | `lucide-react-native` |
| Tests | snapshot per empty state |

## TDD Checklist

- [ ] Snapshot per screen empty state
- [ ] CTA navigates correctly
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
