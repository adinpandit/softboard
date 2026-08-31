import { BoardCard } from "@/components/dashboard/BoardCard";
import { CreateBoardForm } from "@/components/dashboard/CreateBoardForm";
import { listBoards } from "@/lib/boards/repository";

// The dashboard lists every board owned by the signed-in user. RLS scopes the
// query to the owner, so no board belonging to anyone else can appear here.
export default async function DashboardPage() {
  const boards = await listBoards();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">My Boards</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {boards.length === 0
              ? "Create your first softboard to get started."
              : `${boards.length} board${boards.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <CreateBoardForm />
      </div>

      {boards.length > 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <li key={board.id}>
              <BoardCard board={board} />
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
