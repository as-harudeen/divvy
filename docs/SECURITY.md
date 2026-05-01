# Security Guidelines

> Read this when working on authentication, authorization, RLS policies, or any sensitive data access.

## Authentication

- Use Supabase Auth for all user authentication. Do not roll your own.
- Session persistence is handled by `AsyncStorage` via the `@repo/supabase` client. Sessions auto-refresh while the app is foregrounded — wire `supabase.auth.startAutoRefresh()` / `stopAutoRefresh()` to `AppState` in your root layout for production reliability.
- Always validate the user session before rendering sensitive screens:
  ```ts
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) router.replace('/login');
  ```

## Trust Boundary

React Native code runs **on the user's device**. Treat the entire app bundle (and any embedded env var) as public. The trust boundary is the Supabase API surface — RLS, Edge Functions, and database constraints are what actually enforce your security.

| Operation | Where it must run |
|---|---|
| Reading user-owned data | Client (gated by RLS) |
| Mutating user-owned data | Client (gated by RLS) |
| Admin / service-role operations | Supabase Edge Function or your own backend — **never the device** |

## Row Level Security (RLS)

- **RLS must be enabled on every table**. Never disable it.
- Default policy: deny all. Grant only what is needed.
- Keep policies minimal and testable. Example: `auth.uid() = user_id`.
- Test RLS policies using the Supabase dashboard's SQL editor with different roles before shipping.

## Secrets Management

| Variable | Where it lives | Safe to ship in the app bundle? |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `apps/mobile/.env.local` | ✅ Yes |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `apps/mobile/.env.local` | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function env, **not** the app | ❌ Never |

- Any env var prefixed `EXPO_PUBLIC_` is **inlined into the JS bundle at build time** and is therefore public. Treat it as such.
- Never commit `.env.local`. It is in `.gitignore`.
- Add CI secrets to GitHub Actions via **Repository Secrets**, not in `ci.yml` directly.

## Input Validation

- Validate all user input on the server side (RLS policies, Edge Functions, or database constraints).
- Use Zod or a similar schema validator for form inputs **before** calling Supabase.
- Never trust client-provided IDs — `auth.uid()` in your RLS policies is the only trustworthy user identifier.

## Deep Links & URL Handling

- Configure your `scheme` in `app.json`. Validate any data received from a deep link before acting on it — the OS does not authenticate the source.
- Be wary of `Linking.openURL` with user-provided URLs; whitelist where possible.
