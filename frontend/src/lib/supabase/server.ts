import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

import { SUPABASE_COOKIE_OPTIONS } from "./cookie-options";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions. Create a fresh client per request — never share it across requests.
 *
 * Server Components cannot write cookies, so the `setAll` there is a no-op and
 * `src/proxy.ts` is responsible for refreshing the session cookie. Route
 * Handlers and Server Actions can write cookies, so token refreshes and
 * sign-in/out persist correctly from those contexts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    cookieOptions: SUPABASE_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — safe to ignore because the proxy
          // refreshes the session on the next request.
        }
      },
    },
  });
}
