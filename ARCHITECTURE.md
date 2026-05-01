# ARCHITECTURE.md

> Read this when working on project structure, package boundaries, or data flow.
> See [matklad's ARCHITECTURE.md guide](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html) for rationale.

## Monorepo Layout

```
.
├── apps/
│   └── mobile/               # Expo SDK 52 + Expo Router app
├── packages/
│   ├── supabase/             # Supabase client (RN, AsyncStorage)
│   ├── types/                # Shared TypeScript types (no runtime code)
│   ├── ui/                   # Shared React Native component library (NativeWind)
│   └── utils/                # Shared pure utility functions (cn, etc.)
├── .github/workflows/        # GitHub Actions CI
├── biome.json                # Unified lint + format config
├── tsconfig.base.json        # Shared strict TypeScript base
├── turbo.json                # Turborepo pipeline
└── pnpm-workspace.yaml       # pnpm workspace definition
```

## Package Dependency Graph

```
apps/mobile
  ├── @repo/ui        (RN components)
  ├── @repo/supabase  (Supabase client)
  ├── @repo/types     (shared types)
  └── @repo/utils     (utilities)

@repo/ui
  └── @repo/utils     (for cn())

@repo/supabase
  └── (no internal deps — only @supabase/supabase-js + AsyncStorage peer)

@repo/types, @repo/utils
  └── (no internal deps — leaf packages)
```

**Rule**: packages must never import from `apps/`. Apps can import from packages. Packages can import from other packages only if it does not create a cycle.

## Key Architectural Decisions

### Supabase Client Isolation
All Supabase client creation lives in `packages/supabase`. Apps must never instantiate `createClient` from `@supabase/supabase-js` directly. This centralizes config, makes session storage swappable, and makes mocking trivial.

| Context | Use |
|---|---|
| Anywhere in the app | `createClient()` from `@repo/supabase` |

There is **no `server.ts` / `middleware.ts`** — React Native runs as a single client process. Sessions persist via `AsyncStorage` and refresh via `supabase.auth.startAutoRefresh()` (driven by `AppState`).

### Expo Router Conventions
- `app/` — file-based routes (`_layout.tsx`, `index.tsx`, `(group)/...`)
- `src/components/` — app-specific components (not in `@repo/ui`)
- `src/lib/` — app-specific utilities and service wrappers
- `src/hooks/` — custom React hooks
- `src/global.css` — NativeWind entry; do not import elsewhere

### Metro + Workspace Resolution
`apps/mobile/metro.config.js` adds the workspace root to `watchFolders` so Metro picks up live changes in `packages/*`. `disableHierarchicalLookup` keeps node_modules resolution deterministic across the workspace.

### NativeWind v4
- `babel-preset-expo` runs with the `nativewind/babel` preset.
- `metro.config.js` is wrapped with `withNativeWind` and points at `src/global.css`.
- `tailwind.config.js` lives in each app/package that emits classes; the app config scans `packages/ui/src/**` for class extraction.

### TDD Baseline
- `packages/utils/src/cn.test.ts` — unit test example for pure functions
- `packages/ui/src/components/button.test.tsx` — RN component test example (Jest + RNTL)
- `apps/mobile/tests/home.test.tsx` — screen-level smoke test
- `apps/mobile/.maestro/home.yaml` — E2E smoke flow

### Turborepo Task Order
`lint` → `typecheck` → `test` (all cached; `dev` is persistent and uncached). `test:e2e` (Maestro) is uncached and intentionally not run in CI — see `.github/workflows/ci.yml`.
