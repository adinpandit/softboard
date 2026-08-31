import Link from "next/link";

import { BoardActions } from "@/components/board/BoardActions";
import { RelativeTime } from "@/components/board/RelativeTime";
import type { Board } from "@/types/board";

export function BoardCard({ board }: { board: Board }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-neutral-200 p-4 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/boards/${board.id}`}
          className="font-medium underline-offset-4 hover:underline"
        >
          {board.title}
        </Link>
        <BoardActions boardId={board.id} title={board.title} />
      </div>

      {board.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
          {board.description}
        </p>
      ) : null}

      <p className="mt-4 text-xs text-neutral-400">
        Updated <RelativeTime iso={board.updatedAt} />
      </p>
    </div>
  );
}
