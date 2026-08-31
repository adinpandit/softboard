import type { NextConfig } from "next";

// Static security response headers applied to every route.
//
// The Content-Security-Policy is NOT here — it needs a per-request nonce, so it
// is generated in `src/proxy.ts` and currently sent as
// `Content-Security-Policy-Report-Only`. See `src/lib/security/csp.ts`.
const securityHeaders = [
  // Clickjacking protection for the login page and the authenticated dashboard.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing responses away from their declared type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin on cross-origin navigations; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful capabilities the app does not use.
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "browsing-topics=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  },
];

const nextConfig: NextConfig = {
  // Remove the framework-identifying `X-Powered-By` header.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // --- Server Action CSRF (finding F-06) ---------------------------------
  // `experimental.serverActions.allowedOrigins` is intentionally NOT set.
  //
  // Next.js already rejects any Server Action POST whose `Origin` header does
  // not match the `Host` / `X-Forwarded-Host` of the request. For a same-origin
  // deployment (Vercel, or any host where the browser-visible origin equals the
  // server's host) that default check is the correct and sufficient CSRF
  // control, and adding `allowedOrigins` would only widen the trust boundary.
  //
  // If this app is ever served through a reverse proxy or CDN that presents a
  // different external hostname than Next sees internally, add that exact
  // external origin (never "*") to `experimental.serverActions.allowedOrigins`.
};

export default nextConfig;

// ---------------------------------------------------------------------------
// CSP enforcement rollout (currently Report-Only in `src/proxy.ts`):
//   1. Deploy Report-Only, watch the browser console / a report collector for
//      violations across login, signup, forgot/reset password, dashboard, and
//      board pages.
//   2. Add a `report-to` / `report-uri` directive pointing at a collector for
//      production telemetry.
//   3. Once clean, switch `CSP_HEADER` in `src/lib/security/csp.ts` (and the
//      response header in `src/proxy.ts`) from
//      `content-security-policy-report-only` to `content-security-policy`.
//
// HSTS (`Strict-Transport-Security`) is intentionally omitted here: it should be
// set at the production HTTPS edge (e.g. Vercel) so it is never sent during
// local `next dev` / `next start` over plain HTTP.
// ---------------------------------------------------------------------------
