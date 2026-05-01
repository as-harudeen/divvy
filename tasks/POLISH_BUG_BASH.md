# Task: Polish — Bug bash + E2E smoke

## Overview

Full end-to-end exercise of v1 flow on a real device. Catch every bug from week 4. Fix top issues before week 6 ship.

## Requirements

- [ ] Maestro flow `.maestro/full_flow.yaml`:
  - launch app
  - create group "Trip"
  - add 4 people
  - add split #1: $40 even split, all 4 included
  - add split #2: $30 with 1 person excluded (long-press)
  - add split #3: $50 with one custom override (lock 1 row at $20)
  - settle each split via slide-to-pay
  - verify group status flips to `settled`
- [ ] Time the flow; first-time path under 30s for an experienced user (target for Definition of Done)
- [ ] Bug log file `tasks/BUG_LOG.md` — every issue found with reproducer + severity
- [ ] Fix all P0/P1 bugs before this task closes

## Technical Notes

| Item | Detail |
|---|---|
| E2E | Maestro |
| Devices | iPhone simulator + 1 real Android |
| Tests | the flow itself |

## TDD Checklist

- [ ] Maestro flow runs green on iOS sim
- [ ] Maestro flow runs green on Android device
- [ ] All P0/P1 bugs from BUG_LOG resolved
- [ ] `pnpm turbo typecheck` clean
- [ ] Biome clean

## Completed

<!-- fill after task done -->
