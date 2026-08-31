"use client";

// Catches failures from `listBoards()` (e.g. the database is unreachable).
// Next.js logs the underlying error server-side; the client only ever sees this
// generic message and a retry.
export default function DashboardError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-20 text-center">
      <h1 className="text-xl font-semibold">Couldn&apos;t load your boards</h1>
      <p className="text-sm text-neutral-500">
        Something went wrong reaching the database. Please try again.
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        Try again
      </button>
    </main>
  );
}
