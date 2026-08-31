import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { safeRelativePath } from "@/lib/auth/safe-redirect";
import { resolveAppOrigin } from "@/lib/config/app-url";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect from Supabase email links: signup confirmation, magic
// links, and password recovery. Establishes the session cookie, then forwards
// the user to a validated same-origin path (`next`, default `/dashboard`).
//
// Two link styles are supported, depending on the project's email templates:
//  - PKCE (`?code=...`)            -> exchangeCodeForSession
//  - token hash (`?token_hash=&type=`) -> verifyOtp

const OTP_TYPES = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = safeRelativePath(searchParams.get("next"));

  // Destination origin comes from trusted configuration, never the request
  // `Host` header. Falls back to the request origin only when nothing is
  // configured (never on Vercel) — documented residual risk (F-03).
  const origin = resolveAppOrigin() ?? new URL(request.url).origin;

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback", origin));
}
