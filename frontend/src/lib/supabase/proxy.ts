import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

import { SUPABASE_COOKIE_OPTIONS } from "./cookie-options";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Routes that require an authenticated user. */
export const PROTECTED_PREFIXES = ["/dashboard", "/boards"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Serialize the (possibly mutated) request cookie jar back into a header value. */
function cookieHeader(request: NextRequest): string {
  return request.cookies
    .getAll()
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");
}

/**
 * Runs from `src/proxy.ts` on protected routes. It:
 *  1. Refreshes the Supabase session and writes updated cookies onto the response.
 *  2. Redirects unauthenticated users away from protected routes to `/login`.
 *
 * `supabase.auth.getUser()` must be called here (not `getSession()`) so the
 * token is validated against the Supabase Auth server.
 *
 * `forwardedHeaders` carries the CSP nonce headers set in `src/proxy.ts`; they
 * are threaded onto the downstream request so Next can nonce its scripts.
 */
export async function updateSession(
  request: NextRequest,
  forwardedHeaders: Headers,
) {
  const nextWithForwardedHeaders = () => {
    const headers = new Headers(forwardedHeaders);
    headers.set("cookie", cookieHeader(request));
    return NextResponse.next({ request: { headers } });
  };

  let response = nextWithForwardedHeaders();

  const supabase = createServerClient<Database>(
    SUPABASE_URL(),
    SUPABASE_ANON_KEY(),
    {
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = nextWithForwardedHeaders();
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set(
      "redirectTo",
      request.nextUrl.pathname + request.nextUrl.search,
    );

    // Build the redirect from the response that carries any session cookies
    // written during `getUser()` (a refreshed token, or cleared cookies when
    // the refresh token is no longer valid). Dropping them here would leave
    // stale auth cookies in the browser and force another refresh next request.
    const redirectResponse = NextResponse.redirect(loginUrl);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  }

  return response;
}
