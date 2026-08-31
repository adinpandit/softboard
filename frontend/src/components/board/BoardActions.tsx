"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { TitleField } from "@/components/board/TitleField";
import { deleteBoardAction, renameBoardAction } from "@/lib/boards/actions";
import { inspectTitle } from "@/lib/boards/validation";

type Mode = "closed" | "menu" | "renaming" | "confirming-delete";

interface BoardActionsProps {
  boardId: string;
  title: string;
  /** "card" sits in the dashboard grid; "header" sits on the board page. */
  variant?: "card" | "header";
}

export function BoardActions({ boardId, title, variant = "card" }: BoardActionsProps) {
  const [mode, setMode] = useState<Mode>("closed");
  const [error, setError] = useState<string>();
  const [renameValue, setRenameValue] = useState(title);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  const rename = inspectTitle(renameValue);

  function close() {
    setMode("closed");
    setError(undefined);
  }

  function openRename() {
    setRenameValue(title);
    setError(undefined);
    setMode("renaming");
  }

  function submitRename(formData: FormData) {
    startTransition(async () => {
      const result = await renameBoardAction({}, formData);
      if (result.error) setError(result.error);
      else close();
    });
  }

  function submitDelete(formData: FormData) {
    startTransition(async () => {
      // On success the action redirects and this line is never reached.
      const result = await deleteBoardAction({}, formData);
      if (result.error) setError(result.error);
    });
  }

  // Dismiss on outside click / Escape.
  useEffect(() => {
    if (mode === "closed") return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mode]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={mode !== "closed"}
        aria-label={`Actions for ${title}`}
        onClick={() => (mode === "closed" ? setMode("menu") : close())}
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {variant === "header" ? "Manage" : "•••"}
      </button>

      {mode === "menu" ? (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-md border border-neutral-200 bg-white text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <button
            type="button"
            role="menuitem"
            onClick={openRename}
            className="block w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Rename
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => setMode("confirming-delete")}
            className="block w-full px-3 py-2 text-left text-red-600 hover:bg-neutral-100 dark:text-red-400 dark:hover:bg-neutral-800"
          >
            Delete
          </button>
        </div>
      ) : null}

      {mode === "renaming" ? (
        <div className="absolute right-0 z-10 mt-1 w-72 rounded-md border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <form action={submitRename} className="flex flex-col gap-2">
            <input type="hidden" name="boardId" value={boardId} />
            <TitleField
              id={`rename-${boardId}`}
              value={renameValue}
              onChange={setRenameValue}
              autoFocus
              dense
            />
            {error ? (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending || rename.tooLong || rename.empty}
                className="rounded-md bg-neutral-900 px-3 py-1 text-xs font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
              >
                {pending ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {mode === "confirming-delete" ? (
        <div className="absolute right-0 z-10 mt-1 w-72 rounded-md border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          <p className="text-sm">
            Delete <span className="font-medium">{title}</span>? This cannot be undone.
          </p>
          {error ? (
            <p role="alert" className="mt-2 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <form action={submitDelete} className="mt-3 flex justify-end gap-2">
            <input type="hidden" name="boardId" value={boardId} />
            <button
              type="button"
              onClick={close}
              className="rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
            >
              {pending ? "Deleting…" : "Delete"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
