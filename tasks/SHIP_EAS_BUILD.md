# Task: Ship — EAS Build → TestFlight

## Overview

Production build via EAS for iOS. Submit to TestFlight for internal testing.

## Requirements

- [ ] `eas.json` profiles: `development`, `preview`, `production`
- [ ] Apple Developer account active, App Store Connect app entry created
- [ ] Bundle id locked: `com.<vendor>.divvy`
- [ ] Build number auto-increment configured
- [ ] `eas build --platform ios --profile production` runs green
- [ ] `eas submit --platform ios` uploads to TestFlight
- [ ] App passes TestFlight processing (typically 5–30 min)
- [ ] At least 1 internal tester added + invited
- [ ] Tested on real device via TestFlight install

## Technical Notes

| Item | Detail |
|---|---|
| Files | `eas.json`, `apps/mobile/app.json` |
| Auth | `eas login` with Expo account |
| Build envs | strip `__DEV__` seed data; no analytics; HTTPS-only |

## TDD Checklist

- [ ] Production build completes without errors
- [ ] App size reasonable (< 50 MB ideal)
- [ ] No `console.log` noise in release (lint guard or `babel-plugin-transform-remove-console`)
- [ ] TestFlight install + launch on real iPhone
- [ ] Implement
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
