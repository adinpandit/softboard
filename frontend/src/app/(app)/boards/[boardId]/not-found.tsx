import Link from "next/link";

export default function BoardNotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-20 text-center">
      <h1 className="text-xl font-semibold">Board not found</h1>
      <p className="text-sm text-neutral-500">
        This board doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        Back to my boards
      </Link>
    </main>
  );
}
