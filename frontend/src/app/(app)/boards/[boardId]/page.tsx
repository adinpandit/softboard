import { notFound } from "next/navigation";

import { BoardHeader } from "@/components/board/BoardHeader";
import { getBoard } from "@/lib/boards/repository";
import { UUID_RE } from "@/lib/boards/validation";

// Board dashboard. The route is already gated by `src/proxy.ts` (auth) and RLS
// (ownership): `getBoard` returns null both when the board is missing and when
// it belongs to another user, and either way we render a 404.
export default async function BoardPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  if (!UUID_RE.test(boardId)) notFound();

  const board = await getBoard(boardId);
  if (!board) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <BoardHeader board={board} />
      <main className="flex flex-1 items-center justify-center p-6 text-sm text-neutral-400">
        The canvas arrives in Phase 3 — notes, pages, images, links, and threads.
      </main>
    </div>
  );
}
