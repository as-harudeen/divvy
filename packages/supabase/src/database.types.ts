/**
 * Placeholder for Supabase generated types.
 *
 * To generate: run `pnpm --filter @repo/supabase generate-types`
 * This requires the Supabase CLI and a running local/remote instance.
 *
 * See: https://supabase.com/docs/guides/api/rest/generating-types
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
