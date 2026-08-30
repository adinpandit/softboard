// Placeholder route — the board canvas (React Flow) is implemented in Phases 2–4.
// Note: in Next.js 16 `params` is a Promise and must be awaited.
export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Board {boardId}</h1>
      <p className="mt-2 text-sm text-neutral-500">Canvas not implemented yet.</p>
    </main>
  );
}
