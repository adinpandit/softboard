// Resolves the application's own canonical origin (scheme + host) from trusted
// configuration, NEVER from a request-controlled `Host` / `X-Forwarded-Host`
// header. Used to build authentication redirect URLs and the reset-password
// link so an attacker who can spoof a forwarded host cannot redirect users to
// an external origin (audit findings F-03 / F-04).
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL   — explicit, set this for any non-Vercel deploy
//      or a Vercel deploy served on a custom domain.
//   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel, the stable
//      production domain (not the per-deployment preview URL). Trusted.
//   3. http://localhost:3000  — development only.
//   4. null                   — production with nothing configured; callers
//      fall back to a safe behaviour (Supabase's own configured Site URL, or
//      the request origin as a last resort — documented residual risk).
//
// These are public values (origins, not secrets); they are referenced by name
// and never logged.

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function resolveAppOrigin(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    const normalized = normalizeOrigin(explicit);
    if (normalized) return normalized;
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) {
    const normalized = normalizeOrigin(vercel);
    if (normalized) return normalized;
  }

  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }

  return null;
}
