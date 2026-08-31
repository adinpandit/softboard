"use client";

import { BOARD_TITLE_MAX, inspectTitle } from "@/lib/boards/validation";

// Shared controlled title input for the create and rename board forms, so both
// give identical live feedback: a code-point counter (current/120) and an
// inline error once the limit is exceeded. The parent owns the value and uses
// `inspectTitle` to decide whether to enable its submit button.
interface TitleFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  /** compact styling for the rename popover */
  dense?: boolean;
}

export function TitleField({ id, value, onChange, autoFocus, dense }: TitleFieldProps) {
  const { count, tooLong } = inspectTitle(value);
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className={
            dense ? "text-xs font-medium text-neutral-500" : "text-sm font-medium"
          }
        >
          Board title
        </label>
        <span
          aria-live="polite"
          className={`text-xs tabular-nums ${
            tooLong ? "text-red-600 dark:text-red-400" : "text-neutral-400"
          }`}
        >
          {count}/{BOARD_TITLE_MAX}
        </span>
      </div>

      <input
        id={id}
        name="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoFocus={autoFocus}
        aria-invalid={tooLong}
        aria-describedby={tooLong ? errorId : undefined}
        placeholder={dense ? undefined : "AI Project"}
        className={`rounded-md border px-3 py-2 outline-none focus:border-neutral-500 dark:bg-neutral-900 ${
          dense ? "px-2 py-1.5 text-sm dark:bg-neutral-950" : ""
        } ${
          tooLong
            ? "border-red-400 dark:border-red-500"
            : "border-neutral-300 dark:border-neutral-700"
        }`}
      />

      {tooLong ? (
        <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400">
          Title must be {BOARD_TITLE_MAX} characters or fewer.
        </p>
      ) : null}
    </div>
  );
}
