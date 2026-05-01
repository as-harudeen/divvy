# Task: Slide-to-Pay gesture row

## Overview

Hardest single piece of UI. Pan gesture + Reanimated shared value. Three states: idle, sliding (green wipe revealing background), released-to-pay (commits via store). Action label morphs as user drags. Build on Android first — RN gesture quirks differ from iOS. Haptic on commit.

## Requirements

- [ ] `SlideToPayRow` component takes `{ from, to, cents, onCommit }`
- [ ] `react-native-gesture-handler` `Pan` driving `useSharedValue` translateX
- [ ] Background green layer reveals via `useAnimatedStyle` width tied to translateX
- [ ] Threshold (e.g., 70% of row width):
  - Below threshold + release → snap back to 0 (`withSpring`)
  - Above threshold + release → snap to full + call `onCommit` via `runOnJS`
- [ ] Action label states:
  - Idle: "Slide to pay"
  - Sliding: "Keep sliding..."
  - Past threshold: "Release to pay"
- [ ] `expo-haptics` `notificationAsync(Success)` on commit
- [ ] Disabled state (already paid): inert, checkmark
- [ ] 60fps on mid-range Android — gesture must run on UI thread

## Technical Notes

| Item | Detail |
|---|---|
| Component | `components/splits/SlideToPayRow.tsx` |
| Animation | `react-native-reanimated` v3, `useSharedValue`, `useAnimatedStyle`, `withSpring`, `runOnJS` |
| Gesture | `react-native-gesture-handler` v2 `Gesture.Pan()` |
| Tests | component: callback fires past threshold, snaps back below, disabled prop suppresses gesture; **manual** 60fps verification on Android |

## TDD Checklist

- [ ] Drag past threshold → `onCommit` called once
- [ ] Drag below threshold → snap-back, `onCommit` not called
- [ ] Disabled prop blocks gesture entirely
- [ ] Haptic fires on commit
- [ ] Manual: smoke test on real Android device — no jank
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
