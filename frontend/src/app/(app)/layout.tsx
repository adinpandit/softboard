import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { getCurrentUser } from "@/lib/auth/user";

// Shell for authenticated routes. `src/proxy.ts` already redirects unauthenticated
// requests; this is a defensive second check and also gives us the user for the header.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-3 dark:border-neutral-800">
        <Link href="/dashboard" className="font-semibold">
          Softboard
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-neutral-500">{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
