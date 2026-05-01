import AsyncStorage from '@react-native-async-storage/async-storage';
import { type SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Creates a Supabase client for React Native.
 *
 * - Sessions persist via AsyncStorage.
 * - Auto-refresh is enabled; wire it to AppState in your root layout for production:
 *
 *   ```ts
 *   import { AppState } from 'react-native';
 *   import { createClient } from '@repo/supabase';
 *
 *   const supabase = createClient();
 *   AppState.addEventListener('change', (state) => {
 *     if (state === 'active') supabase.auth.startAutoRefresh();
 *     else supabase.auth.stopAutoRefresh();
 *   });
 *   ```
 *
 * - `detectSessionInUrl` is disabled because RN does not have a URL bar; magic-link callbacks
 *   should be handled via deep links + `supabase.auth.exchangeCodeForSession()`.
 *
 * Env vars MUST be prefixed with `EXPO_PUBLIC_` so they reach the JS bundle.
 */
export function createClient(): SupabaseClient<Database> {
  return createSupabaseClient<Database>(
    // biome-ignore lint/style/noNonNullAssertion: Validated at startup
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    // biome-ignore lint/style/noNonNullAssertion: Validated at startup
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    },
  );
}
