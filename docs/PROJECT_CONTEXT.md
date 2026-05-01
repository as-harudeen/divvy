# Project Context

> Read this when making decisions about product scope, user-facing features, or business priorities.

## What This Is

This is a **starter template** for cross-platform mobile apps using Expo, React Native, Supabase, and Turborepo.

It is designed to be cloned and adapted. The goal is to eliminate project-setup boilerplate so teams can ship features from day one — with TDD, strict types, and a CI pipeline already in place.

## Target Audience

- Developers starting a new mobile app, MVP, or internal tool
- Teams that want a production-grade foundation without spending time on configuration
- Engineering leads who want AI agents to work reliably inside a well-structured codebase

## Non-Goals

- This template does not ship with authentication UI flows (login/signup screens) — that is up to the consuming project.
- It does not include a database schema — Supabase migration files and RLS policies are project-specific.
- It does not include native push notifications, deep linking schemes beyond the default, or analytics integration — wire those in per-project.
- It does not include a UI design system beyond the `Button` example — extend `packages/ui` as your design system grows.

## First Steps After Cloning

1. Copy `apps/mobile/.env.example` → `apps/mobile/.env.local` and fill in your Supabase credentials.
2. Run `pnpm install`.
3. Run `pnpm --filter @repo/supabase generate-types` to generate your database types.
4. Run `pnpm turbo test` to verify the baseline tests pass.
5. Run `pnpm dev` and open in Expo Go (or a dev client) on a simulator/device.
6. Start building.
