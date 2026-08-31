// Nonce-based Content-Security-Policy, built per request in `src/proxy.ts`.
//
// Deployed as `Content-Security-Policy-Report-Only` first (see `src/proxy.ts`)
// so violations are reported without breaking the app; flip to the enforcing
// `Content-Security-Policy` header once reports are clean.

/** Request header carrying the per-request nonce to Server Components. */
export const NONCE_HEADER = "x-nonce";

/**
 * Report-Only CSP header name. Next.js reads the nonce from either this header
 * or `content-security-policy` on the incoming request, so setting it on the
 * forwarded request headers is what makes Next add `nonce="…"` to its own
 * <script> tags.
 */
export const CSP_HEADER = "content-security-policy-report-only";

/** 128 bits of randomness, base64 — matches Next's nonce source regex. */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function supabaseConnectSources(): string[] {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const url = new URL(raw);
    // Auth + PostgREST over HTTPS, Realtime over WSS (same host).
    return [url.origin, `wss://${url.host}`];
  } catch {
    return [];
  }
}

export function buildContentSecurityPolicy(nonce: string): string {
  // `next dev` (Turbopack HMR, React DevTools) needs eval; production never
  // does. This keeps the production policy strict while avoiding Report-Only
  // console noise during local development.
  const devEval =
    process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

  const directives: string[] = [
    "default-src 'self'",
    // 'strict-dynamic' lets the nonced Next bootstrap script load the rest of
    // the chunks; 'self' is kept as a fallback for browsers without CSP3.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${devEval}`,
    // Inline styles only — Next/React inject <style> tags and style attributes
    // that cannot carry a nonce. Styles cannot execute script, so this does not
    // undermine the script protection.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src ${["'self'", ...supabaseConnectSources()].join(" ")}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    // Note: `upgrade-insecure-requests` is intentionally omitted — it is
    // ignored in a Report-Only policy (and produces a console warning). Add it
    // when switching `CSP_HEADER` to the enforcing `content-security-policy`.
  ];

  return directives.join("; ");
}
