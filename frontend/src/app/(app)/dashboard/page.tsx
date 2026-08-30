import { getCurrentUser } from "@/lib/auth/user";

// Board list + create lands here in a later phase. For now this confirms the
// authenticated session and shows the current user.
export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">My Boards</h1>
      <p className="mt-2 text-sm text-neutral-500">
        No boards yet — board management arrives in the next phase.
      </p>

      <dl className="mt-8 grid max-w-md grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
        <dt className="text-neutral-500">Signed in as</dt>
        <dd>{user?.email}</dd>
        <dt className="text-neutral-500">User ID</dt>
        <dd className="font-mono text-xs">{user?.id}</dd>
      </dl>
    </main>
  );
}
