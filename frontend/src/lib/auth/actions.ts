"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { resolveAppOrigin } from "@/lib/config/app-url";
import { createClient } from "@/lib/supabase/server";

import {
  validateCredentials,
  validateEmail,
  validatePassword,
} from "./credentials";
import { safeRelativePath } from "./safe-redirect";

export interface AuthFormState {
  error?: string;
  /** Set when signup succeeds but the email must still be confirmed. */
  notice?: string;
}

/** Shown for any failed login, so a wrong password and an unknown account look identical. */
const GENERIC_LOGIN_ERROR = "Incorrect email or password.";
/** Shown after signup when we must not reveal whether the address is already registered. */
const CONFIRM_EMAIL_NOTICE =
  "Check your email to confirm your account, then log in.";
/** Shown after every password-reset request, whether or not the address exists. */
const PASSWORD_RESET_NOTICE =
  "If an account exists for this email, we've sent a password reset link.";
const RATE_LIMITED_ERROR =
  "Too many attempts. Please wait a moment and try again.";
const RECOVERY_SESSION_EXPIRED =
  "Your reset link is invalid or has expired. Request a new one from the login page.";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  const invalid = validateCredentials(email, password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Do not surface the raw Supabase message: it distinguishes "wrong
    // password" from "email not confirmed" / "user not found" and leaks
    // whether an account exists. Rate limiting is the one case worth calling
    // out so the user knows to wait rather than retrying immediately.
    if (error.status === 429) {
      return { error: "Too many attempts. Please wait a moment and try again." };
    }
    return { error: GENERIC_LOGIN_ERROR };
  }

  revalidatePath("/", "layout");
  redirect(safeRelativePath(formData.get("redirectTo")));
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password } = readCredentials(formData);
  const invalid = validateCredentials(email, password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.status === 429) {
      return { error: "Too many attempts. Please wait a moment and try again." };
    }
    // "User already registered" (returned when email confirmation is disabled)
    // would reveal that the address exists. Respond exactly as we do for a
    // fresh signup that still needs confirmation.
    if (
      error.code === "user_already_exists" ||
      error.status === 422 ||
      /already\s+registered/i.test(error.message)
    ) {
      return { notice: CONFIRM_EMAIL_NOTICE };
    }
    return { error: "Could not create your account. Please try again." };
  }

  // With email confirmation enabled, no session is returned yet. Supabase also
  // returns this shape (no session, obfuscated user) for an existing confirmed
  // address, so the same message covers both without enumeration.
  if (!data.session) {
    return { notice: CONFIRM_EMAIL_NOTICE };
  }

  revalidatePath("/", "layout");
  redirect(safeRelativePath(formData.get("redirectTo")));
}

/**
 * Step 1 of password recovery: email a reset link. The response is identical
 * whether or not the address is registered, so it never discloses account
 * existence. The link points at the existing `/auth/callback`, which then
 * forwards to `/reset-password`.
 */
export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const invalid = validateEmail(email);
  if (invalid) return { error: invalid };

  const supabase = await createClient();

  // Build the reset link from trusted configuration, never a request-controlled
  // forwarded host (F-04). When no app origin is configured (production without
  // NEXT_PUBLIC_SITE_URL / Vercel), omit `redirectTo` entirely so Supabase uses
  // its own dashboard-configured Site URL — still trusted.
  const appOrigin = resolveAppOrigin();
  const options = appOrigin
    ? {
        redirectTo: `${appOrigin}/auth/callback?next=${encodeURIComponent(
          "/reset-password",
        )}`,
      }
    : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(email, options);

  // Rate limiting is the only outcome worth surfacing; anything else (success,
  // or "user not found") returns the same neutral notice.
  if (error?.status === 429) {
    return { error: RATE_LIMITED_ERROR };
  }
  return { notice: PASSWORD_RESET_NOTICE };
}

/**
 * Step 2 of password recovery: set a new password. Requires the recovery
 * session established by `/auth/callback`. Passwords and tokens are never
 * logged. On success the recovery session is cleared and the user re-logs in
 * with the new password.
 */
export async function updatePassword(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const invalid = validatePassword(password);
  if (invalid) return { error: invalid };
  if (password !== confirmPassword) {
    return { error: "The two passwords do not match." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: RECOVERY_SESSION_EXPIRED };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.status === 429) return { error: RATE_LIMITED_ERROR };
    if (error.code === "same_password") {
      return {
        error: "Your new password must be different from your current password.",
      };
    }
    if (error.code === "weak_password") {
      return { error: "Please choose a stronger, less common password." };
    }
    if (error.code === "session_not_found" || error.status === 401) {
      return { error: RECOVERY_SESSION_EXPIRED };
    }
    return { error: "Could not update your password. Please try again." };
  }

  // Force a fresh login with the new password.
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?reset=success");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
