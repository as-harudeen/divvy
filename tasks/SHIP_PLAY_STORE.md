# Task: Ship — Google Play internal testing

## Overview

Production AAB via EAS for Android. Upload to Play Console internal testing track.

## Requirements

- [ ] Google Play Console account active, app entry created
- [ ] Package name locked: `com.<vendor>.divvy`
- [ ] Signing key managed by Play (let Google sign) or via EAS managed credentials
- [ ] `eas build --platform android --profile production` runs green
- [ ] `eas submit --platform android --track internal` uploads
- [ ] Internal testing track populated; at least 1 tester added (email)
- [ ] Data safety form completed (Task 5.2)
- [ ] Tested on real device via Play Internal install

## Technical Notes

| Item | Detail |
|---|---|
| Files | `eas.json`, `apps/mobile/app.json` |
| Build artifact | AAB (`.aab`) for Play Store |
| Permissions | review `android.permissions` in app.json — minimal set only |

## TDD Checklist

- [ ] Production AAB builds
- [ ] Submitted to internal track without policy warnings
- [ ] App installs + launches via Play Internal
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
