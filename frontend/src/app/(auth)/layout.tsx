import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Already signed in? Skip the auth screens.
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-6">
      {children}
    </main>
  );
}
