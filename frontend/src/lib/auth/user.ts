import { cache } from "react";

import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user for the current request, or `null`.
 * Safe to call from Server Components — the token is validated against the
 * Supabase Auth server.
 *
 * Wrapped in `React.cache` so the layout, page, and any Server Actions in one
 * request share a single validated result instead of each making its own round
 * trip to the Auth server. The cache is per-request, so it never leaks a user
 * between requests.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
