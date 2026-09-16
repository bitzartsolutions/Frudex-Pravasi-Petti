import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Anon-role Supabase client for public storefront reads (categories,
 * products, variants) that don't depend on a signed-in session. Unlike
 * lib/supabase/server.ts, this never touches `cookies()`, so pages that use
 * it exclusively can still be statically generated / ISR'd instead of being
 * forced fully dynamic on every request.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
