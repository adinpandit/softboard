import type { CookieOptions } from "@supabase/ssr";

/**
 * Cookie hardening applied to every Supabase auth cookie, shared by the server
 * client and the proxy so both write identical attributes.
 *
 * - `httpOnly: true` — the auth + PKCE-verifier cookies are never read from
 *   client JavaScript. This app has no browser Supabase client: `createServerClient`
 *   always reads cookies through the `getAll`/`setAll` we provide (backed by
 *   `next/headers` `cookies()` and the proxy's request/response), which see
 *   HTTP-only cookies server-side. The `document.cookie` fallback in
 *   `@supabase/ssr` only runs for `createBrowserClient` / a browser runtime,
 *   neither of which exists here. HTTP-only removes session-token theft as a
 *   consequence of any XSS (audit finding F-02). Reintroducing a browser
 *   Supabase client (e.g. Phase 6 realtime) would require revisiting this.
 * - `sameSite: "lax"` — matches the `@supabase/ssr` default; the cookie is not
 *   sent on cross-site subrequests but survives top-level navigation.
 * - `secure` — production only. Local `next dev` serves over plain HTTP, where a
 *   `Secure` cookie is silently dropped and login breaks.
 */
export const SUPABASE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};
