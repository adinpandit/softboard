"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user";

import {
  createBoard,
  deleteBoard,
  renameBoard,
} from "./repository";
import {
  UUID_RE,
  normalizeDescription,
  normalizeTitle,
  validateDescription,
  validateTitle,
} from "./validation";

// Server Actions are the only mutation entry point for boards. Each one
// re-checks authentication (they are reachable by direct POST, not just via our
// UI), validates input, delegates persistence to the repository, then
// revalidates the affected routes. Authorization itself is enforced by RLS.

export interface BoardActionState {
  error?: string;
  /** Set after a successful mutation so client forms can close/reset. */
  ok?: boolean;
}

const OK: BoardActionState = { ok: true };

export async function createBoardAction(
  _prev: BoardActionState,
  formData: FormData,
): Promise<BoardActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const title = normalizeTitle(formData.get("title"));
  const description = normalizeDescription(formData.get("description"));

  const titleError = validateTitle(title);
  if (titleError) return { error: titleError.message };
  const descriptionError = validateDescription(description);
  if (descriptionError) return { error: descriptionError.message };

  let newBoardId: string;
  try {
    const board = await createBoard({
      ownerId: user.id,
      title,
      description: description || null,
    });
    newBoardId = board.id;
  } catch {
    return { error: "Could not create the board. Please try again." };
  }

  revalidatePath("/dashboard");
  redirect(`/boards/${newBoardId}`);
}

export async function renameBoardAction(
  _prev: BoardActionState,
  formData: FormData,
): Promise<BoardActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = String(formData.get("boardId") ?? "");
  if (!UUID_RE.test(id)) return { error: "That board could not be found." };

  const title = normalizeTitle(formData.get("title"));
  const titleError = validateTitle(title);
  if (titleError) return { error: titleError.message };

  let renamed: boolean;
  try {
    renamed = await renameBoard(id, title);
  } catch {
    return { error: "Could not rename the board. Please try again." };
  }
  if (!renamed) return { error: "That board could not be found." };

  revalidatePath("/dashboard");
  revalidatePath(`/boards/${id}`);
  return OK;
}

/**
 * Delete a board and return to the dashboard. Used with `useActionState`; on
 * success it redirects, so a returned state only ever carries an error.
 */
export async function deleteBoardAction(
  _prev: BoardActionState,
  formData: FormData,
): Promise<BoardActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const id = String(formData.get("boardId") ?? "");
  if (!UUID_RE.test(id)) return { error: "That board could not be found." };

  let deleted: boolean;
  try {
    deleted = await deleteBoard(id);
  } catch {
    return { error: "Could not delete the board. Please try again." };
  }
  if (!deleted) return { error: "That board could not be found." };

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
