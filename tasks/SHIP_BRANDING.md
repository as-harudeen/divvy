# Task: Ship — Branding (icon, splash, store screenshots)

## Overview

App icon, splash screen, App Store + Play Store screenshots. Use mockups as starting point for marketing imagery.

## Requirements

- [ ] App icon: 1024×1024 master, all platform sizes generated via `expo-icon` config
- [ ] Splash screen: matches first-launch background, app logo centered, fades to home
- [ ] iOS screenshots: 6.7" + 6.5" + 5.5" required sets (5 screenshots each minimum)
- [ ] Android screenshots: phone (5 minimum); 7" + 10" tablet optional
- [ ] Feature graphic for Play Store (1024×500)
- [ ] Adaptive icon (Android): foreground + background layers

## Technical Notes

| Item | Detail |
|---|---|
| Files | `apps/mobile/assets/icon.png`, `splash.png`, `adaptive-icon.png` |
| Config | `apps/mobile/app.json` — `icon`, `splash`, `android.adaptiveIcon` |
| Generation | use Expo's `expo-cli icon` or Figma export; verify on real devices |

## TDD Checklist

- [ ] Icon renders correctly on iOS home screen
- [ ] Icon renders correctly on Android (adaptive)
- [ ] Splash matches first frame of home (no flash)
- [ ] Screenshots reviewed for spelling + UI fidelity
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
