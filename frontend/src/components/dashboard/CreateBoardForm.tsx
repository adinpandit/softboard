"use client";

import { useActionState, useState } from "react";

import { TitleField } from "@/components/board/TitleField";
import { createBoardAction, type BoardActionState } from "@/lib/boards/actions";
import { BOARD_DESCRIPTION_MAX, inspectTitle } from "@/lib/boards/validation";

const INITIAL: BoardActionState = {};

export function CreateBoardForm() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [state, action, pending] = useActionState(createBoardAction, INITIAL);

  const { tooLong, empty } = inspectTitle(title);

  function reset() {
    setOpen(false);
    setTitle("");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        + Create Softboard
      </button>
    );
  }

  return (
    <form
      action={action}
      className="w-full max-w-md rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
    >
      <div className="flex flex-col gap-3">
        <TitleField id="create-board-title" value={title} onChange={setTitle} autoFocus />

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">
            Description <span className="text-neutral-400">(optional)</span>
          </span>
          <textarea
            name="description"
            rows={2}
            maxLength={BOARD_DESCRIPTION_MAX}
            className="resize-y rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900"
          />
        </label>

        {state.error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {state.error}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending || tooLong || empty}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-neutral-900"
          >
            {pending ? "Creating…" : "Create board"}
          </button>
        </div>
      </div>
    </form>
  );
}
