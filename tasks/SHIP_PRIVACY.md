# Task: Ship — Privacy policy + Terms

## Overview

4-sentence privacy policy. Single-device, no collection, no analytics is the selling point — write it that way. Terms only if required.

## Requirements

- [ ] `docs/privacy.md` — 4 sentences:
  1. Divvy stores all data locally on your device.
  2. We do not collect, transmit, or sell any personal information.
  3. There are no accounts, no tracking, no analytics.
  4. Uninstalling Divvy permanently erases your groups and splits.
- [ ] Hosted at a public URL (GitHub Pages, Netlify, or static page on your domain) — required by App Store
- [ ] App Store privacy questionnaire: "Data Not Collected" across the board
- [ ] Play Store data safety form: same
- [ ] Terms of Service (optional v1) — `docs/terms.md` boilerplate

## Technical Notes

| Item | Detail |
|---|---|
| Files | `docs/privacy.md`, `docs/terms.md` (optional) |
| Hosting | GitHub Pages from `docs/` is simplest |
| App Store Connect | privacy URL required field |

## TDD Checklist

- [ ] Privacy URL reachable
- [ ] Reviewed for accuracy (no analytics SDK present in code — grep guard)
- [ ] Privacy questionnaire submitted truthfully
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
