"use client";

import Link from "next/link";

// Catches unexpected failures while loading a board (database errors). "Not
// found" / "not yours" is handled separately by `not-found.tsx`. Next.js logs
// the underlying error server-side; the client only sees this generic message.
export default function BoardError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-20 text-center">
      <h1 className="text-xl font-semibold">Couldn&apos;t open this board</h1>
      <p className="text-sm text-neutral-500">
        Something went wrong reaching the database. Please try again.
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={retry}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
        >
          All boards
        </Link>
      </div>
    </main>
  );
}
