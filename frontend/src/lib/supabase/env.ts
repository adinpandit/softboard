// Reads the public Supabase env vars and fails loudly if they are missing,
// so a misconfigured deploy produces a clear message instead of an opaque
// "supabaseUrl is required" from deep inside the client library.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy frontend/.env.local.example ` +
        `to frontend/.env.local and fill it in from your Supabase project settings.`,
    );
  }
  return value;
}

export const SUPABASE_URL = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const SUPABASE_ANON_KEY = () =>
  required(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
