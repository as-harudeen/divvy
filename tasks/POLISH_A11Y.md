# Task: Polish — Accessibility pass

## Overview

Every interactive element labeled. Layout survives 200% Dynamic Type. State changes announced. Screen-reader pass on every screen.

## Requirements

- [ ] `accessibilityLabel` on every `Pressable` / `TouchableOpacity`
- [ ] `accessibilityRole` set appropriately (`button`, `header`, `summary`)
- [ ] `accessibilityState` for toggles (selected, disabled, checked)
- [ ] Live region announcements for: balance banner state changes, split saved, transfer marked paid
- [ ] No fixed-height containers around scaling text — use `minHeight` or flex
- [ ] Test at 200% Dynamic Type on iOS (Settings → Accessibility → Display → Larger Text)
- [ ] VoiceOver pass on every screen
- [ ] TalkBack pass on every screen

## Technical Notes

| Item | Detail |
|---|---|
| Tests | manual on real devices; lint rule (`react-native-a11y` or biome custom check) for `accessibilityLabel` on Pressable |
| Live region | `accessibilityLiveRegion="polite"` (Android); on iOS use `AccessibilityInfo.announceForAccessibility` |

## TDD Checklist

- [ ] Lint guard: every Pressable has accessibilityLabel
- [ ] Manual: VoiceOver reads sane labels on every screen
- [ ] Manual: TalkBack reads sane labels on every screen
- [ ] Manual: 200% Dynamic Type — no clipped text
- [ ] Implement fixes
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
