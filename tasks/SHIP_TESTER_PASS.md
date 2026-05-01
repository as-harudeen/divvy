# Task: Ship — Tester pass + final fixes

## Overview

Five real testers. Watch ≥3 sessions. Don't help. Take notes. Fix top blockers. Ship to production.

## Requirements

- [ ] 5 testers recruited (mix of tech-comfort levels)
- [ ] Each tester gets a real bill scenario (e.g., "split last night's dinner with 3 friends")
- [ ] ≥ 3 sessions watched live (FaceTime / screen share / in-person)
- [ ] No coaching during sessions
- [ ] Notes captured in `tasks/TESTER_NOTES.md` per tester
- [ ] Top 3 blockers identified (where ≥2 testers struggled)
- [ ] Fix the 3 blockers
- [ ] Re-test fixes with at least 1 of the original testers
- [ ] Promote production build:
  - iOS: TestFlight build → App Store submission for review
  - Android: Internal track → Production track (or Closed/Open testing per rollout strategy)

## Technical Notes

| Item | Detail |
|---|---|
| Files | `tasks/TESTER_NOTES.md`, `tasks/BUG_LOG.md` (carry-over from 4.6) |
| Definition of Done check | re-verify all 8 v1 DoD criteria from FEATURE_PLAN.md |

## TDD Checklist

- [ ] 5 testers complete the 4-person split flow
- [ ] Time-to-first-split measured (< 30s target)
- [ ] Top 3 blockers fixed + verified
- [ ] App Store submission accepted (no rejection) OR rejection-recovery plan executed
- [ ] Play Store production rollout active
- [ ] All Definition of Done criteria pass
- [ ] `pnpm turbo typecheck` clean
- [ ] Biome clean

## Completed

<!-- fill after task done -->
