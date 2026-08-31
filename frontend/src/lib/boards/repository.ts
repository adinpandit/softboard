// Board data-access layer. Everything that touches the `boards` table lives here
// so UI and Server Actions never build queries directly. Every call goes through
// the request-scoped Supabase client (anon key + the user's session cookie), so
// Row Level Security is always enforced — this module never uses service-role
// credentials and never bypasses RLS.

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Board } from "@/types/board";
import type { BoardRow } from "@/types/database";

function toBoard(row: BoardRow): Board {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Thrown on any database failure. The message is a generic, user-safe string —
 * the underlying Supabase/Postgres error is attached as `cause` (captured in
 * server logs by Next.js) and never reaches the client.
 */
class BoardRepositoryError extends Error {
  constructor(userMessage: string, cause: unknown) {
    super(userMessage, { cause });
    this.name = "BoardRepositoryError";
  }
}

const MESSAGES = {
  list: "Could not load your boards. Please try again.",
  read: "Could not open this board. Please try again.",
  create: "Could not create the board. Please try again.",
  rename: "Could not rename the board. Please try again.",
  delete: "Could not delete the board. Please try again.",
} as const;

/**
 * All boards owned by the current user, most recently updated first.
 * RLS guarantees other users' boards are never returned.
 * `cache` dedupes within a single request (page + layout).
 */
export const listBoards = cache(async (): Promise<Board[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw new BoardRepositoryError(MESSAGES.list, error);
  return (data ?? []).map(toBoard);
});

/**
 * A single board by id, or `null` when it does not exist or is not owned by the
 * current user (RLS makes those two cases indistinguishable, which is what we
 * want — no information leak about other users' board ids).
 */
export const getBoard = cache(async (id: string): Promise<Board | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new BoardRepositoryError(MESSAGES.read, error);
  return data ? toBoard(data) : null;
});

/**
 * Insert a board owned by `ownerId`. The caller must pass the authenticated
 * user's id; the RLS INSERT policy additionally enforces `owner_id = auth.uid()`.
 */
export async function createBoard(input: {
  ownerId: string;
  title: string;
  description?: string | null;
}): Promise<Board> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .insert({
      owner_id: input.ownerId,
      title: input.title,
      description: input.description ?? null,
    })
    .select("*")
    .single();

  if (error) throw new BoardRepositoryError(MESSAGES.create, error);
  return toBoard(data);
}

/**
 * Rename a board. Returns `false` when no row was updated (board missing or not
 * owned — RLS filters the UPDATE to the owner's rows). The `updated_at` column
 * is refreshed by a database trigger.
 */
export async function renameBoard(id: string, title: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .update({ title })
    .eq("id", id)
    .select("id");

  if (error) throw new BoardRepositoryError(MESSAGES.rename, error);
  return (data?.length ?? 0) > 0;
}

/**
 * Delete a board. Returns `false` when no row was deleted (missing or not owned).
 */
export async function deleteBoard(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("boards")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) throw new BoardRepositoryError(MESSAGES.delete, error);
  return (data?.length ?? 0) > 0;
}
