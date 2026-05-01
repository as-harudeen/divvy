# Divvy v1 — Feature Plan

> Source: `Divvy_Build_Plan.pdf`. Each row below is one task file. Copy `TASK_TEMPLATE.md` to `tasks/<SLUG>.md` and fill in from the row.
>
> **Order matters.** Foundation → math → core flow → polish → ship. Do not reorder. Do not start a screen before its store + math primitive exists.
>
> v1 is local-first, single-device, no auth, no sync. Repo has `@repo/supabase` — leave it idle for v1.

---

## Phase 0 · Foundation (Week 1)

No screens. Build the floor.

| # | Slug | Goal | Key deliverables | Tests |
|---|---|---|---|---|
| 0.1 | `FOUNDATION_TOOLCHAIN.md` | Project boots on iOS sim + real Android device | Verify Expo build, add `lucide-react-native`, `react-native-reanimated`, `react-native-gesture-handler`, `zustand`, `nanoid`, `expo-haptics`, `@gorhom/bottom-sheet`. Confirm Biome + typecheck pass. | smoke: app launches; `pnpm turbo typecheck` clean |
| 0.2 | `FOUNDATION_THEME.md` | Design tokens locked | `packages/ui` or `apps/mobile/src/theme.ts`: colors, spacing, radii, type scale. Load Inter + JetBrains Mono via `expo-font`. Build a `/design` debug route rendering every primitive. | visual: every primitive renders; type loads |
| 0.3 | `FOUNDATION_MONEY.md` | Cents-only money lib | `lib/money.ts`: `toCents`, `fromCents`, `formatCents` (Intl.NumberFormat), `equalSplit(totalCents, n) → cents[]` with deterministic remainder distribution (first N people get +1). Ban floats in money paths. | unit: $10/3 → [334,333,333]; $0.01/3 → [1,0,0]; $100/4 → [2500×4]; large totals; n=1 |
| 0.4 | `FOUNDATION_SETTLE.md` | Min-transactions algorithm | `lib/settle.ts`: net-balance computation per person across splits, greedy pair largest creditor with largest debtor, return transfer list `{from,to,cents}`. Pure function, no React. | unit: 2 people; 4 equal; 4 with one over-payer; 4 with two payers different amounts; all balanced → 0 transfers; odd cents totals; one person owes multiple |
| 0.5 | `FOUNDATION_ROUTING.md` | Expo Router skeleton | All 7 routes stubbed: `app/index.tsx`, `app/group/new.tsx`, `app/group/[id]/index.tsx`, `app/group/[id]/split/new.tsx`, `app/group/[id]/split/[splitId]/settle.tsx`, `app/group/[id]/split/[splitId]/detail.tsx`. Type-safe links. | nav: every route reachable from a debug menu |
| 0.6 | `FOUNDATION_STORES.md` | Zustand stores + persistence | `stores/people.ts`, `stores/groups.ts`, `stores/splits.ts`, `stores/app.ts` with `persist` middleware over AsyncStorage. Schema versioning + migration stub. Seed dev data via `__DEV__` flag. | unit: round-trip persist; version migration no-op |

---

## Phase 1 · Home + Group creation (Week 2)

Screens 01, 02, 02b. End user can create a group, see it on Home.

| # | Slug | Screen / scope | Requirements | Tests |
|---|---|---|---|---|
| 1.1 | `HOME_GROUP_LIST.md` | `app/index.tsx` (Screen 01) | `GroupCard` with ACTIVE badge, status pill (open/settled), context strip "Splitting under <group>", FAB → create. Empty state "No groups yet". Match mockup. | component: GroupCard states; empty state; FAB nav |
| 1.2 | `CREATE_GROUP.md` | `app/group/new.tsx` (Screen 02) | Name input, member pills, Recents list (people from global Person table), dimmed-when-added state, member counter. Save → activeGroupId set. | component: add/remove member; counter; recents excludes already-added |
| 1.3 | `ADD_PERSON_SHEET.md` | Bottom sheet (Screen 02b) | `@gorhom/bottom-sheet`. First-name input, auto-assign avatar color via `hash(personId) mod 7` from curated palette. Writes to global people store. | component: validates non-empty; deterministic color; appears in Recents |

---

## Phase 2 · Group detail + Split creation (Week 3)

Screens 03, 04. Core flow works.

| # | Slug | Screen / scope | Requirements | Tests |
|---|---|---|---|---|
| 2.1 | `GROUP_DETAIL.md` | `app/group/[id]/index.tsx` (Screen 03) | Member row (avatars), balance card (net per user from `settle.ts`), splits feed sorted by `createdAt` desc, FAB → new split. Status pill recomputes on splits change. | component: balance updates on split add; empty splits state |
| 2.2 | `SPLIT_NEW_NUMPAD.md` | `app/group/[id]/split/new.tsx` total entry | Numpad-driven big total in JetBrains Mono. Label input. Payer picker. Mode toggle: Equally / By share / Custom. | component: numpad input → totalCents; mode toggle preserves overrides where valid |
| 2.3 | `SPLIT_NEW_SHARES.md` | Same screen, per-person rows | Live recompute every keystroke via `equalSplit`. `ShareRow` per member. Long-press → exclude (greys out, share=0, not in `equalSplit` pool). Balance banner: Remaining / Over by / Balanced with color states. | component: exclude removes from pool; banner state machine; overrides preserved across mode flips where valid |
| 2.4 | `SPLIT_LOCK_OVERRIDE.md` | Override interaction in Split new | Tap a person's amount → enter custom value → row locked (amber border) → re-divide remainder among unlocked. All-locked → banner reflects diff. | component: 4 people, 2 locked → unlocked re-div correct; over-locked → "Over by" |

---

## Phase 3 · Settlement + Slide-to-pay (Week 4)

Screens 05, 06. Hardest UI in the app.

| # | Slug | Screen / scope | Requirements | Tests |
|---|---|---|---|---|
| 3.1 | `SETTLEMENT_SCREEN.md` | `app/group/[id]/split/[splitId]/settle.tsx` (Screen 05) | Render `settle.ts` transfers as "X pays Y $Z" rows. Tap row → mark paid (writes `paidAt`). Group status flips to `settled` when all transfers paid. | component: paid toggle persists; group status derive |
| 3.2 | `SPLIT_DETAIL_OWNER.md` | `app/group/[id]/split/[splitId]/detail.tsx` (Screen 06) | Header (label, total, payer), per-person share list, slide-to-pay row per outstanding transfer. Read-only fork via role flag (no multi-user yet, but respect the flag). | component: read-only flag hides slide row |
| 3.3 | `SLIDE_TO_PAY.md` | Gesture component (Screen 06) | `react-native-gesture-handler` Pan + `reanimated` `useSharedValue` / `useAnimatedStyle`. States: idle → sliding (green wipe revealing) → released-to-pay. Action label changes live. Build on Android first. Haptic on completion. | component: snap-back below threshold; commit above; 60fps on mid-range Android |

---

## Phase 4 · Polish (Week 5)

No new screens. Quality bar.

| # | Slug | Scope | Requirements | Tests |
|---|---|---|---|---|
| 4.1 | `POLISH_EMPTY_STATES.md` | All lists | "No groups", "No splits in this group", "No recent people". Match design system tone. | visual snapshot per state |
| 4.2 | `POLISH_HAPTICS.md` | Key actions | `expo-haptics`: success on split saved, success on slide-to-pay commit, warning on invalid state. | manual: device verification |
| 4.3 | `POLISH_KEYBOARD.md` | Inputs | `KeyboardAvoidingView` + `react-native-keyboard-controller` for split-new + create-group. No keyboard covering inputs. | manual: iOS + Android |
| 4.4 | `POLISH_A11Y.md` | App-wide | `accessibilityLabel` on every Pressable. Layout survives 200% Dynamic Type. State changes announced. | manual: VoiceOver/TalkBack pass |
| 4.5 | `POLISH_LOCALE.md` | Money display | All `$` go through `Intl.NumberFormat`. Lint rule banning bare `$` template literals in components. | unit: format USD; grep guard |
| 4.6 | `POLISH_BUG_BASH.md` | E2E smoke | 4-person group, 3 splits (one with override, one excluded person, one even), settle each. List + fix bugs. | maestro: end-to-end flow under 30s |

---

## Phase 5 · Ship (Week 6)

| # | Slug | Scope |
|---|---|---|
| 5.1 | `SHIP_BRANDING.md` | App icon, splash, store screenshots derived from mockups |
| 5.2 | `SHIP_PRIVACY.md` | 4-sentence privacy policy (single-device, no collection, no analytics). Terms if required. |
| 5.3 | `SHIP_EAS_BUILD.md` | EAS production build, TestFlight submission |
| 5.4 | `SHIP_PLAY_STORE.md` | Internal testing track upload |
| 5.5 | `SHIP_TESTER_PASS.md` | 5 testers, 3 watched sessions, top-3 fixes |

---

## Cross-cutting guardrails

Apply to **every** task:

- TDD per `AGENTS.md`. Red → green → refactor.
- Integer cents in storage. Floats forbidden outside `lib/money.ts` display formatters.
- `pnpm turbo typecheck` + Biome clean before mark complete.
- No new entity types beyond Person / Group / Split / Settlement / AppState.
- v2 backlog file (`tasks/V2_BACKLOG.md`) absorbs every "wouldn't it be cool" idea — never inline into v1 tasks.

## Definition of Done (v1)

Hard gate before App Store submit:

1. All 7 screens match mockups within reasonable visual tolerance.
2. New user → 4-person split in **under 30s** without instructions (timed).
3. `tests/settle.test.ts` ≥ 8 scenarios, all green.
4. 60fps on a 3-year-old mid-range Android.
5. Reinstall cycle: data wipes cleanly, app loads fresh, no crash.
6. 200% Dynamic Type survives without layout breaks.
7. Store listings complete (icon, screenshots, description, privacy).
8. ≥ 5 real testers exercised real bills; ≥ 3 sessions watched; top blockers fixed.

## Out of scope (refuse on sight)

Auth · cloud sync · payment integrations · OCR/bill scan · receipt photos · multi-currency · recurring splits · push notifications · web/desktop/watch · analytics/telemetry · dark mode · localization.

Park in `tasks/V2_BACKLOG.md`.
