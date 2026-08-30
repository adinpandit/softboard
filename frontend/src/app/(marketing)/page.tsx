import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Softboard</h1>
      <p className="text-balance text-lg text-neutral-600 dark:text-neutral-400">
        A visual workspace for notes, pages, images, and links — arranged freely
        and connected with threads.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium dark:border-neutral-700"
        >
          Log in
        </Link>
      </div>
    </main>
  );
}
