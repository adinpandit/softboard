import { NextResponse, type NextRequest } from "next/server";

import {
  CSP_HEADER,
  NONCE_HEADER,
  buildContentSecurityPolicy,
  generateNonce,
} from "@/lib/security/csp";
import { isProtectedPath, updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renamed the `middleware` convention to `proxy` (Node.js runtime).
//
// Two concerns run here:
//  1. A per-request nonce + Content-Security-Policy (Report-Only) applied to
//     every document response. The CSP header is also placed on the *forwarded
//     request* headers so Next extracts the nonce and stamps its own scripts.
//  2. Supabase session refresh + protected-route redirects — only for
//     `/dashboard` and `/boards`, preserving the existing narrow behaviour.
export async function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildContentSecurityPolicy(nonce);

  const forwardedHeaders = new Headers(request.headers);
  forwardedHeaders.set(NONCE_HEADER, nonce);
  forwardedHeaders.set(CSP_HEADER, csp);

  const response = isProtectedPath(request.nextUrl.pathname)
    ? await updateSession(request, forwardedHeaders)
    : NextResponse.next({ request: { headers: forwardedHeaders } });

  response.headers.set(CSP_HEADER, csp);
  return response;
}

export const config = {
  // Run on every document/route request, but skip static assets and Next
  // internals so CSS/JS/images/fonts are never intercepted. Prefetch requests
  // are skipped too (they carry no document to protect).
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|map)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
