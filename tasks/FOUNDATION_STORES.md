# Task: Foundation — Zustand stores + persistence

## Overview

Four stores: people (global), groups, splits, app (singleton: activeGroupId, userPersonId, version). Persist to AsyncStorage via `zustand/middleware/persist`. Schema versioning + migration stub. Dev seed data behind `__DEV__`.

## Requirements

- [ ] `stores/people.ts` — `Person { id, name, avatarColor, createdAt }`. Actions: `addPerson`, `getById`. Never delete (soft-hide only).
- [ ] `stores/groups.ts` — `Group { id, name, memberIds[], createdAt, lastActivityAt, status }`. Actions: `createGroup`, `addMember`, `removeMember`, `recomputeStatus(groupId)`.
- [ ] `stores/splits.ts` — `Split { id, groupId, label, totalCents, payerId, createdAt, shares: Record<PersonId, cents>, settlementStatus, transfers? }`. Actions: `createSplit`, `markTransferPaid`, `selectByGroup(groupId)`. **Invariant: `sum(shares) === totalCents`** — enforce on write.
- [ ] `stores/app.ts` — `{ activeGroupId, userPersonId, version }`. Actions: `setActiveGroup`, `bootstrapUser` (creates "You" Person on first launch).
- [ ] All stores use `persist` middleware over AsyncStorage
- [ ] `version` field + migration function (no-op for v1)
- [ ] Dev seed: 2 groups, 4 people, 3 splits, gated by `__DEV__`

## Technical Notes

| Item | Detail |
|---|---|
| Files | `apps/mobile/src/stores/{people,groups,splits,app}.ts` |
| Persistence | `AsyncStorage` from `@react-native-async-storage/async-storage` |
| Types | export from `@repo/types` |
| IDs | `nanoid/non-secure` |

## TDD Checklist

- [ ] Round-trip: write → rehydrate → values equal
- [ ] Split invariant: writing `shares` that don't sum to `totalCents` throws
- [ ] Migration: `version: 0` data loads on `version: 1` store
- [ ] `bootstrapUser` idempotent
- [ ] `pnpm turbo typecheck` clean

## Completed

<!-- fill after task done -->
