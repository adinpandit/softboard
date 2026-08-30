import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Supabase client for use in Client Components (browser).
 * The session is stored in cookies so the server can read it too.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL(), SUPABASE_ANON_KEY());
}
