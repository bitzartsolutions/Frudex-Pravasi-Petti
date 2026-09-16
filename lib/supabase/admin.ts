import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Service-role Supabase client. Bypasses RLS entirely — use only in
 * trusted server contexts (Route Handlers, Server Actions) for operations
 * that must ignore row-level policies, e.g. server-side price lookups
 * during order creation. Never import this into anything that could end
 * up in a Client Component bundle; the `server-only` import enforces that
 * at build time.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
