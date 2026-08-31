// Credential rules shared by the auth Server Actions and the client forms, so
// client-side hints and the authoritative server checks never diverge.

/** Minimum password length. Enforced server-side; mirrored by the forms' `minLength`. */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Maximum password length. Supabase Auth (GoTrue) rejects passwords longer than
 * 72 characters (the bcrypt input limit), and characters past that add no
 * entropy anyway. Capping here gives a clear message instead of an opaque
 * Supabase error and bounds oversized input.
 */
export const PASSWORD_MAX_LENGTH = 72;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns a user-facing message when the email is unusable, else `null`. */
export function validateEmail(email: string): string | null {
  if (!email || !EMAIL_RE.test(email)) {
    return "Enter a valid email address.";
  }
  return null;
}

/** Returns a user-facing message when the password length is out of range, else `null`. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}

/** Combined email + password check used by login and signup. */
export function validateCredentials(email: string, password: string): string | null {
  return validateEmail(email) ?? validatePassword(password);
}
