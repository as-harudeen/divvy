# Task: Polish — Keyboard handling

## Overview

Keyboard must not cover inputs. Two screens matter: Create Group (name input) and Split New (label, custom share value). NumPad is in-app so it doesn't trigger system keyboard.

## Requirements

- [ ] `KeyboardAvoidingView` (or `react-native-keyboard-controller`) on Create Group + Split New
- [ ] Name/label inputs always visible while focused
- [ ] Custom share inline editor scrolls into view on focus
- [ ] Dismiss keyboard on background tap (`TouchableWithoutFeedback`)
- [ ] Test on iOS + Android — behavior differs

## Technical Notes

| Item | Detail |
|---|---|
| Lib | `react-native-keyboard-controller` (preferred — handles inset interruptions cleanly) |
| Files | `apps/mobile/app/group/new.tsx`, `apps/mobile/app/group/[id]/split/new.tsx` |
| Tests | manual on both platforms |

## TDD Checklist

- [ ] Manual: iOS — keyboard appearance does not cover focused input
- [ ] Manual: Android — same
- [ ] Background tap dismisses
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
