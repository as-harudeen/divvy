# Task: [Feature Name]

> Copy this file to `tasks/YOUR_FEATURE_TASK.md` and fill it in before prompting an agent.

## Overview

[2-3 sentences describing what this feature is and why it's needed.]

## Requirements

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Technical Notes

| Item | Detail |
|---|---|
| Screen / Route | e.g., `app/(tabs)/orders/index.tsx` (Expo Router) |
| Component | e.g., extend `@repo/ui` or create in `apps/mobile/src/components/` |
| Data fetching | e.g., `createClient()` from `@repo/supabase`, called inside a `useEffect` or via TanStack Query |
| State management | e.g., URL params (`useLocalSearchParams`), React state, Zustand |
| Tests to write first | e.g., unit: `OrderList`, component: `OrderRow`, e2e: `.maestro/orders.yaml` |

## TDD Checklist

- [ ] Write failing unit tests for the core logic / component (Jest + RNTL)
- [ ] Write a failing E2E flow for the user journey (Maestro)
- [ ] Implement to make tests pass
- [ ] Run `pnpm turbo typecheck` — no errors
- [ ] Run `pnpm turbo lint` — no issues
- [ ] All tests green

## Completed

<!-- Agent: fill this in after the task is done -->
<!-- Describe what was implemented, any deviations from the plan, and where tests live -->
