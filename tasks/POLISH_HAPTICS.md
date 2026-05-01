# Task: Polish — Haptics

## Overview

`expo-haptics` on key actions. ~30 minutes of work, dramatic perceived-quality lift.

## Requirements

- [ ] Split saved → `Notification.Success`
- [ ] Slide-to-pay commit → `Notification.Success` (already in Task 3.3)
- [ ] Mark transfer paid (settlement screen) → `Impact.Light`
- [ ] Invalid save attempt (over/under banner) → `Notification.Warning`
- [ ] Long-press exclude member → `Impact.Medium`
- [ ] No haptic on simple navigation (avoid noise)
- [ ] Helper `lib/haptics.ts` wraps `expo-haptics` so calls are one-liners

## Technical Notes

| Item | Detail |
|---|---|
| File | `apps/mobile/src/lib/haptics.ts` |
| Calls | `success()`, `warning()`, `light()`, `medium()` |
| Tests | mock `expo-haptics`; assert correct call on each trigger |

## TDD Checklist

- [ ] Saving split fires success haptic
- [ ] Save attempt with banner !== "Balanced" fires warning haptic
- [ ] Long-press exclude fires medium impact
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
