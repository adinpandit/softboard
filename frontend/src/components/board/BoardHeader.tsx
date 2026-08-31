import Link from "next/link";

import { BoardActions } from "@/components/board/BoardActions";
import { RelativeTime } from "@/components/board/RelativeTime";
import type { Board } from "@/types/board";

// Board dashboard header: identity + management controls for a single board.
export function BoardHeader({ board }: { board: Board }) {
  return (
    <header className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <Link
        href="/dashboard"
        className="text-sm text-neutral-500 underline-offset-4 hover:underline"
      >
        ← All boards
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{board.title}</h1>
          {board.description ? (
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              {board.description}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-neutral-400">
            Updated <RelativeTime iso={board.updatedAt} />
          </p>
        </div>

        <BoardActions boardId={board.id} title={board.title} variant="header" />
      </div>
    </header>
  );
}
