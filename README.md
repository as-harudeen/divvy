<div align="center">

# react-native-supabase-tdd-template

**A production-ready Turborepo monorepo template for shipping React Native apps fast.**

![Expo](https://img.shields.io/badge/Expo-SDK%2052-000020?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-green?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Jest](https://img.shields.io/badge/Jest-passing-99425b?logo=jest)
![Maestro](https://img.shields.io/badge/Maestro-E2E-orange)

</div>

---

## Stack

| Layer | Tool |
|---|---|
| Monorepo | [Turborepo](https://turbo.build) + [pnpm](https://pnpm.io) |
| Mobile | [Expo SDK 52](https://expo.dev) + [Expo Router v4](https://docs.expo.dev/router/introduction/) + [React Native 0.76](https://reactnative.dev) |
| Styling | [NativeWind v4](https://www.nativewind.dev) (Tailwind for React Native) |
| Backend / Auth / DB | [Supabase](https://supabase.com) (RN SDK + AsyncStorage session) |
| Unit + Component Tests | [Jest](https://jestjs.io) + [`jest-expo`](https://docs.expo.dev/develop/unit-testing/) + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) |
| E2E Tests | [Maestro](https://maestro.mobile.dev) |
| Lint + Format | [Biome](https://biomejs.dev) |
| Types | TypeScript 5 (strict mode) |
| CI | GitHub Actions |

---

## Features

- ✅ **TDD-first baseline** — unit, component, and E2E test examples ship with the template
- ✅ **Monorepo** — 4 shared packages (`ui`, `utils`, `types`, `supabase`)
- ✅ **Supabase** — RN client centralised in `@repo/supabase` with `AsyncStorage` session persistence
- ✅ **Strict TypeScript** — `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
- ✅ **Single linter** — Biome replaces ESLint + Prettier
- ✅ **CI pipeline** — lint → typecheck → test → expo-doctor (GitHub Actions)
- ✅ **Agent-ready** — `AGENTS.md`, `ARCHITECTURE.md`, `docs/`, `tasks/TASK_TEMPLATE.md`

---

## Getting Started

### 1. Clone (or use as a template)

```bash
git clone https://github.com/as-harudeen/react-native-supabase-tdd-template.git my-app
cd my-app
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment

```bash
cp apps/mobile/.env.example apps/mobile/.env.local
# Fill in EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

### 4. Generate Supabase types

```bash
# Requires Supabase CLI (https://supabase.com/docs/guides/cli)
pnpm --filter @repo/supabase generate-types
```

### 5. Verify baseline tests pass

```bash
pnpm turbo test
```

### 6. Start the dev server

```bash
pnpm dev
# Then press i (iOS), a (Android), or scan the QR with Expo Go
```

---

## Monorepo Layout

```
.
├── apps/
│   └── mobile/              # Expo SDK 52 + Expo Router app
├── packages/
│   ├── supabase/            # Supabase client (AsyncStorage session)
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # Shared React Native component library (NativeWind)
│   └── utils/               # Shared pure utilities (cn, etc.)
├── docs/                    # Agent context docs
├── tasks/                   # Feature task templates
├── AGENTS.md                # AI agent instructions
└── ARCHITECTURE.md          # Monorepo map + decisions
```

---

## Useful Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start Metro for the mobile app |
| `pnpm turbo test` | Run all unit/component tests (Jest) |
| `pnpm turbo lint` | Lint all packages (Biome) |
| `pnpm turbo typecheck` | Type-check all packages |
| `pnpm --filter mobile ios` | Build + run on iOS simulator |
| `pnpm --filter mobile android` | Build + run on Android emulator |
| `pnpm --filter mobile test:e2e` | Run Maestro E2E flows |

---

## TDD Workflow

1. Copy `tasks/TASK_TEMPLATE.md` → `tasks/MY_FEATURE_TASK.md`
2. Write failing tests first (Jest or Maestro)
3. Implement until all tests pass
4. Run `pnpm turbo typecheck && pnpm turbo lint`
5. Fill in the **Completed** section of your task file

---

## License

MIT
