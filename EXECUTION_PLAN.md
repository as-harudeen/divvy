# Divvy v1 — Execution Plan

> Operational playbook for shipping v1 in 6 weeks solo. Maps the 26 task files in [tasks/](tasks/) to a day-by-day cadence with dependency gates.
>
> Read order on day 1: this file → [tasks/FEATURE_PLAN.md](tasks/FEATURE_PLAN.md) → [AGENTS.md](AGENTS.md) → [docs/PROJECT_CONTEXT.md](docs/PROJECT_CONTEXT.md).
>
> Cadence assumption: ~24 hrs/week (4 hrs weekday + half-day Sat). Adjust if your reality differs — but **do not reorder phases**.

---

## Legend

| Marker | Meaning |
|---|---|
| 🔒 | Blocker — must complete before any task in next phase starts |
| 🔁 | Iterative — return to as bugs surface |
| 🧪 | Test gate — phase cannot close without tests green |
| 🚦 | Phase exit gate — full criteria below |

## Dependency graph

```
Phase 0 (Foundation)
  TOOLCHAIN ──┬─> ROUTING ────────────┐
              ├─> THEME ──────────────┤
              ├─> MONEY 🔒 ───┬─> SETTLE 🔒
              └─> STORES (depends on MONEY types)
                                       │
Phase 1 ────────────────────────────────┴─>
  HOME_GROUP_LIST ──> CREATE_GROUP ──> ADD_PERSON_SHEET

Phase 2
  GROUP_DETAIL ──> SPLIT_NEW_NUMPAD ──> SPLIT_NEW_SHARES ──> SPLIT_LOCK_OVERRIDE

Phase 3
  SETTLEMENT_SCREEN ──> SPLIT_DETAIL_OWNER ──> SLIDE_TO_PAY 🔒

Phase 4 (parallelizable internally)
  EMPTY_STATES ║ HAPTICS ║ KEYBOARD ║ A11Y ║ LOCALE ──> BUG_BASH 🚦

Phase 5
  BRANDING ──> PRIVACY ──> EAS_BUILD ║ PLAY_STORE ──> TESTER_PASS 🚦
```

`🔒 MONEY` and `🔒 SETTLE` are the two hard blockers. If math wrong, app wrong. **No screen work until both have ≥ 8 passing scenarios.**

---

## Week 1 · Foundation + algorithms

**Goal:** project boots, design tokens locked, money + settlement libs bulletproof. **Zero screens.**

| Day | Task | Done when |
|---|---|---|
| Mon | [FOUNDATION_TOOLCHAIN.md](tasks/FOUNDATION_TOOLCHAIN.md) | App launches on iOS sim AND a real Android device. `pnpm turbo typecheck` clean. |
| Tue | [FOUNDATION_ROUTING.md](tasks/FOUNDATION_ROUTING.md) | All 7 stub routes reachable; type-safe links compile. |
| Wed | [FOUNDATION_THEME.md](tasks/FOUNDATION_THEME.md) | `_design.tsx` route renders every primitive; Inter + JetBrains Mono load. |
| Thu | [FOUNDATION_MONEY.md](tasks/FOUNDATION_MONEY.md) 🧪 | `tests/money.test.ts` green ≥ 8 cases incl. odd-cents. |
| Fri | [FOUNDATION_SETTLE.md](tasks/FOUNDATION_SETTLE.md) 🧪 🔒 | `tests/settle.test.ts` green ≥ 8 scenarios. |
| Sat | [FOUNDATION_STORES.md](tasks/FOUNDATION_STORES.md) | All 4 zustand stores persist + rehydrate; split invariant enforced. |

**🚦 Phase 0 exit gate:**
- `tests/money.test.ts` + `tests/settle.test.ts` green ≥ 8 each
- Stores round-trip via AsyncStorage
- Biome + typecheck clean
- App boots cleanly on real Android

If any item red — **do not start Phase 1**. Algorithm bugs compound through every screen.

---

## Week 2 · Home + Group creation

**Goal:** screens 01, 02, 02b shipping. End-to-end: create group → see on Home.

| Day | Task | Done when |
|---|---|---|
| Mon-Tue | [HOME_GROUP_LIST.md](tasks/HOME_GROUP_LIST.md) | Group cards render; ACTIVE badge + status pill correct; FAB nav works; empty state present. |
| Wed | [CREATE_GROUP.md](tasks/CREATE_GROUP.md) | Name + members captured; counter + recents dim correctly; save creates Group + sets active. |
| Thu | [ADD_PERSON_SHEET.md](tasks/ADD_PERSON_SHEET.md) | Bottom sheet creates Person; deterministic avatar color; appears in Recents. |
| Fri-Sat | Trim + buffer | Pixel-match mockups; empty states for Recents + groups; manual smoke on Android. |

**🚦 Phase 1 exit gate:**
- Create a 4-person group from cold-start in < 60s
- Re-launch app — group still there
- Empty states present on every list

---

## Week 3 · Group detail + Split creation (core)

**Goal:** core flow lives. Create group → add split → see balances.

| Day | Task | Done when |
|---|---|---|
| Mon | [GROUP_DETAIL.md](tasks/GROUP_DETAIL.md) | Member row, balance card (uses `computeNetBalances`), splits feed, FAB → split-new. |
| Tue-Wed | [SPLIT_NEW_NUMPAD.md](tasks/SPLIT_NEW_NUMPAD.md) | NumPad drives totalCents; label + payer set; mode toggle wired (no share rows yet). |
| Thu | [SPLIT_NEW_SHARES.md](tasks/SPLIT_NEW_SHARES.md) | Per-person rows; long-press exclude; live recompute; banner state machine. |
| Fri | [SPLIT_LOCK_OVERRIDE.md](tasks/SPLIT_LOCK_OVERRIDE.md) | Tap to override → amber lock; remainder re-distributes among unlocked. |
| Sat | Trim + reducer doc | Write reducer state diagram in code comments — week 5 future-you needs it. |

**🚦 Phase 2 exit gate:**
- 4-person split with 1 excluded + 1 locked override → banner reaches "Balanced"
- Save persists; group balance card updates immediately
- Re-launch — split still there with all overrides intact

---

## Week 4 · Settlement + Slide-to-pay

**Goal:** screens 05 + 06. Slide-to-pay feels native.

| Day | Task | Done when |
|---|---|---|
| Mon | [SETTLEMENT_SCREEN.md](tasks/SETTLEMENT_SCREEN.md) | Transfers render from `settle()`; tap toggles paid; group status flips when all paid. |
| Tue-Thu | [SLIDE_TO_PAY.md](tasks/SLIDE_TO_PAY.md) 🔒 | Pan gesture + reanimated; threshold commits; haptic on success; **smooth on Android**. |
| Fri | [SPLIT_DETAIL_OWNER.md](tasks/SPLIT_DETAIL_OWNER.md) | Header + share list + slide rows; role flag honored. |
| Sat | E2E smoke (manual) | Group of 4 → 3 splits (one override, one excluded, one even) → settle each. Log bugs to `tasks/BUG_LOG.md`. **Do not fix yet** — fix in week 5. |

**🚦 Phase 3 exit gate:**
- Slide-to-pay 60fps on a 3-year-old mid-range Android
- All transfers in a settled group reach paid state
- `BUG_LOG.md` populated from Sat smoke

---

## Week 5 · Polish, edge cases, accessibility

**Goal:** "works" → "feels good". Where amateur and shipped diverge.

Polish tasks parallelizable — pick by mood. Aim for 1/day.

| Day | Task |
|---|---|
| Mon | [POLISH_EMPTY_STATES.md](tasks/POLISH_EMPTY_STATES.md) |
| Tue | [POLISH_HAPTICS.md](tasks/POLISH_HAPTICS.md) |
| Wed | [POLISH_KEYBOARD.md](tasks/POLISH_KEYBOARD.md) |
| Thu | [POLISH_LOCALE.md](tasks/POLISH_LOCALE.md) |
| Fri | [POLISH_A11Y.md](tasks/POLISH_A11Y.md) |
| Sat | [POLISH_BUG_BASH.md](tasks/POLISH_BUG_BASH.md) — Maestro flow + clear `BUG_LOG.md` P0/P1 |

**🚦 Phase 4 exit gate (Definition of Done preview):**
- Maestro full-flow E2E runs green on iOS sim + Android real device
- All P0/P1 bugs from week 4 + week 5 closed
- 200% Dynamic Type — no clipped text on any screen
- VoiceOver + TalkBack pass per screen
- Grep guard: zero `` `\\$\\$` `` literals in `components/`

---

## Week 6 · Ship

**Goal:** TestFlight + Play Internal live; 5 testers exercised real bills.

| Day | Task |
|---|---|
| Mon | [SHIP_BRANDING.md](tasks/SHIP_BRANDING.md) — icon, splash, screenshots |
| Tue | [SHIP_PRIVACY.md](tasks/SHIP_PRIVACY.md) — policy hosted, App Store + Play forms filled |
| Wed | [SHIP_EAS_BUILD.md](tasks/SHIP_EAS_BUILD.md) — production build → TestFlight |
| Thu | [SHIP_PLAY_STORE.md](tasks/SHIP_PLAY_STORE.md) — AAB → Play Internal track |
| Fri | [SHIP_TESTER_PASS.md](tasks/SHIP_TESTER_PASS.md) — 5 testers; watch ≥ 3 sessions; capture notes |
| Sat | Fix top 3 blockers from tester pass; promote to production |

**🚦 v1 ship gate (hard):**
1. All 7 screens match mockups within reasonable visual tolerance
2. New user → 4-person split in **< 30s** without instructions (timed)
3. `tests/settle.test.ts` ≥ 8 scenarios, all green
4. 60fps on 3-year-old mid-range Android
5. Reinstall cycle: data wipes cleanly, app loads fresh, no crash
6. 200% Dynamic Type survives without layout breaks
7. Store listings complete (icon, screenshots, description, privacy)
8. ≥ 5 real testers exercised real bills; ≥ 3 sessions watched; top blockers fixed

---

## Daily ritual (cap 4 hrs)

1. **Pull task file** — read Requirements + TDD Checklist top-to-bottom
2. **Write failing tests first** (Jest + RNTL or Maestro per task)
3. **Implement until green**
4. **Run** `pnpm turbo typecheck && pnpm biome check .`
5. **Manual sanity** on real device for any UI task
6. **Fill in `## Completed`** section of the task file before closing
7. **Commit** — small, scoped, conventional commits

## Weekly ritual (Sunday — 30 min, off the laptop)

- Review previous week's task `## Completed` blocks
- Move surfaced ideas to [tasks/V2_BACKLOG.md](tasks/V2_BACKLOG.md) — never inline into v1
- Confirm next week's gate criteria are reachable
- Take Sun off in week 3. Real off. No commits.

---

## Risk register (live — update as bites land)

| Risk | Likelihood | Mitigation | Status |
|---|---|---|---|
| Settlement off-by-one on remainder | High | Tests-first, week 1 gate | open |
| Slide-to-pay janks on Android | High | Build on Android first, not iOS | open |
| Float math creep | High | Lint guard outside `lib/money.ts` | open |
| Scope creep into expense tracking | Medium | All "wouldn't it be cool" → V2_BACKLOG | open |
| Solo burnout week 4 | Medium | Real Sun off week 3; algorithm-win week 1 | open |
| App Store rejection | Medium | No auth, no payments — minimal surface; read Guidelines §5 before submit | open |
| AsyncStorage data loss on uninstall | Low | Document in app footer; v2 cloud backup | open |
| Avatar color collisions ugly | Low | Curated 7-palette, hash mod 7 | open |

---

## Stop-the-line conditions

Halt all forward work, fix immediately:

- A money test goes red after ever being green
- A settlement test goes red after ever being green
- App fails to launch on a real Android device
- Reinstall causes a crash on launch
- App Store / Play Store reject submission

Everything else can queue.

---

## Out of scope — do not build

See [tasks/V2_BACKLOG.md](tasks/V2_BACKLOG.md). Reread it any time temptation hits.

---

## Cross-cutting standards (per [AGENTS.md](AGENTS.md))

- TDD first. Red → green → refactor.
- TypeScript strict. No `any`, no `!` non-null assertions without biome-ignore + reason.
- Integer cents in storage. Floats forbidden outside `lib/money.ts` formatters.
- `pnpm turbo typecheck` + Biome clean before any task closes.
- No raw Supabase clients in app code (Supabase package idle for v1; revisit v2 sync).
- Every interactive element labeled.
- Conventional commits, small + scoped.
