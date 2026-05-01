# Roadmap

> This is your project's task list. Keep it up to date as you build.

## Template Bootstrap (pre-done)

- [x] Turborepo + pnpm monorepo
- [x] Expo SDK 52 + Expo Router v4
- [x] React Native 0.76 + React 18.3
- [x] NativeWind v4 styling
- [x] Supabase client package (RN, AsyncStorage)
- [x] Shared packages: `@repo/ui`, `@repo/utils`, `@repo/types`
- [x] Jest + `jest-expo` + RNTL unit/component testing baseline
- [x] Maestro E2E baseline
- [x] Biome lint + format
- [x] GitHub Actions CI
- [x] Agent documentation (AGENTS.md, ARCHITECTURE.md, docs/)

## Your Project — Next Steps

- [ ] Copy `apps/mobile/.env.example` → `apps/mobile/.env.local` and fill in Supabase credentials
- [ ] Run `pnpm --filter @repo/supabase generate-types` to generate DB types
- [ ] Create your Supabase tables and enable RLS
- [ ] Build authentication screens (login, signup, magic-link callback via deep link)
- [ ] Wire `AppState` → `supabase.auth.startAutoRefresh/stopAutoRefresh` in root layout
- [ ] Configure app icon, splash screen, and `scheme` in `app.json`
- [ ] Extend `packages/ui` with your component library
- [ ] Define your `docs/DESIGN_SYSTEM.md` tokens
- [ ] Add your first feature — write the test first!
