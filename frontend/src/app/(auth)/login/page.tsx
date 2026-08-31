import { AuthForm } from "@/components/auth/AuthForm";
import type { AuthFormState } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; reset?: string; error?: string }>;
}) {
  const { redirectTo, reset, error } = await searchParams;

  const initialState: AuthFormState = {};
  if (reset === "success") {
    initialState.notice =
      "Your password has been updated. Please log in with your new password.";
  } else if (error === "auth_callback") {
    initialState.error =
      "That link is invalid or has expired. Please request a new one.";
  }

  return (
    <AuthForm mode="login" redirectTo={redirectTo} initialState={initialState} />
  );
}
