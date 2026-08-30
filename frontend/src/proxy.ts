import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renamed the `middleware` convention to `proxy` (Node.js runtime).
// Session refresh + protected-route redirects live in `updateSession`.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Keep this in sync with PROTECTED_PREFIXES in src/lib/supabase/proxy.ts.
  matcher: ["/dashboard/:path*", "/boards/:path*"],
};
