export default function BoardLoading() {
  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div className="h-4 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mt-3 h-7 w-56 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="h-4 w-64 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
