import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getCurrentUser } from "@/lib/auth/user";

// Deliberately NOT in the (auth) route group: password recovery arrives here
// *with* a (recovery) session, and the (auth) layout would redirect any
// signed-in visitor to the dashboard. Access is gated on that session instead.
export default async function ResetPasswordPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6">
      {user ? (
        <ResetPasswordForm />
      ) : (
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold">This link isn&apos;t valid</h1>
          <p className="text-sm text-neutral-500">
            Password reset links can only be used once and expire a short time
            after they&apos;re sent. Request a new one to continue.
          </p>
          <Link href="/forgot-password" className="text-sm underline">
            Request a new reset link
          </Link>
        </div>
      )}
    </main>
  );
}
