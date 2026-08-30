import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user for the current request, or `null`.
 * Safe to call from Server Components — the token is validated against the
 * Supabase Auth server.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
