# AGENTS.md

## Project Overview

A production-ready monorepo template using Expo, React Native, Supabase, and Turborepo — built for Test-Driven Development.

- Read `ARCHITECTURE.md` when working on project structure, package boundaries, or data flow.
- Read `docs/DESIGN_SYSTEM.md` when working on UI components, styling, or visual design.
- Read `docs/SECURITY.md` when working on authentication, authorization, RLS policies, or any sensitive data access.
- Read `docs/PROJECT_CONTEXT.md` when making decisions that affect product scope or user-facing behaviour.

## Tech Stack

- **OS**: Linux / macOS
- **Package manager**: pnpm (v9)
- **Monorepo**: Turborepo
- **Mobile**: Expo SDK 52 + Expo Router v4, React Native 0.76, React 18.3
- **Styling**: NativeWind v4 (Tailwind for React Native) via `@repo/ui`
- **Backend / Auth / DB**: Supabase (RN client with AsyncStorage session persistence)
- **Tests**: Jest + `jest-expo` + React Native Testing Library (unit/component), Maestro (E2E)
- **Linting / Formatting**: Biome (single tool — replaces ESLint + Prettier)
- **CI**: GitHub Actions

## Standards

1. **TDD first**: write tests before (or alongside) the implementation. Never merge code without passing tests.
2. **TypeScript strict**: `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` are on. Do not use `any` or `!` non-null assertions without a `// biome-ignore` justification comment.
3. **Run `pnpm turbo typecheck` before marking a task complete.**
4. **Biome over comments**: fix lint issues via code, not suppression comments, unless there is a justified reason.
5. **No raw Supabase clients in app code**: always import from `@repo/supabase`. Centralised config keeps mocking and rotation trivial.
6. **`EXPO_PUBLIC_` prefix is mandatory** for any env var that must reach the device bundle. Never put service-role keys behind it.
