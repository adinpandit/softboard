// Board input rules, shared by Server Actions and the client forms.
// Mirrors the CHECK constraints in `supabase/migrations/0001_boards.sql`.
//
// Server-side `validateTitle` / `validateDescription` remain the authoritative
// checks; the client helpers below only drive live UI feedback.

export const BOARD_TITLE_MAX = 120;
export const BOARD_DESCRIPTION_MAX = 2000;

/** UUID v4-ish shape, used to reject junk board ids before hitting Postgres. */
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Count Unicode code points, matching PostgreSQL's `char_length()`. Plain
 * `String.prototype.length` counts UTF-16 code units, which over-counts
 * astral characters (e.g. most emoji count as 2) and would disagree with the
 * database constraint.
 */
export function countChars(value: string): number {
  return [...value].length;
}

// Invisible / control characters with no legitimate place in board text and
// which enable visual spoofing (bidi override "Trojan Source" reordering,
// zero-width padding). Standard whitespace (U+0009–U+000D) is deliberately
// excluded so it is normalised below instead of deleted. ZWNJ (U+200C) and
// ZWJ (U+200D) are also excluded — they are required by Arabic, Persian and
// Indic scripts and by emoji sequences.
const DISALLOWED_CODE_POINTS: ReadonlySet<number> = (() => {
  const set = new Set<number>();
  for (let c = 0x00; c <= 0x08; c += 1) set.add(c); // C0 controls
  for (let c = 0x0e; c <= 0x1f; c += 1) set.add(c);
  for (let c = 0x7f; c <= 0x9f; c += 1) set.add(c); // DEL + C1 controls
  for (let c = 0x202a; c <= 0x202e; c += 1) set.add(c); // LRE/RLE/PDF/LRO/RLO
  for (let c = 0x2066; c <= 0x2069; c += 1) set.add(c); // LRI/RLI/FSI/PDI
  for (const c of [0x061c, 0x200b, 0x200e, 0x200f, 0x2028, 0x2029, 0xfeff]) {
    set.add(c); // ALM, ZWSP, LRM, RLM, line/para separators, BOM
  }
  return set;
})();

function stripDisallowed(value: string): string {
  let out = "";
  for (const char of value) {
    if (!DISALLOWED_CODE_POINTS.has(char.codePointAt(0) ?? 0)) out += char;
  }
  return out;
}

/**
 * Strip spoofing-prone invisible characters, collapse whitespace, and trim.
 * This is the canonical form we store. Normal international text is untouched.
 */
export function normalizeTitle(raw: unknown): string {
  return stripDisallowed(String(raw ?? ""))
    .replace(/\s+/g, " ")
    .trim();
}

/** As `normalizeTitle` but preserves internal newlines (the field is a textarea). */
export function normalizeDescription(raw: unknown): string {
  return stripDisallowed(String(raw ?? "")).trim();
}

export type BoardFieldError = { field: "title" | "description"; message: string };

export function validateTitle(title: string): BoardFieldError | null {
  const length = countChars(title.trim());
  if (length < 1) return { field: "title", message: "Enter a board title." };
  if (length > BOARD_TITLE_MAX) {
    return {
      field: "title",
      message: `Title must be ${BOARD_TITLE_MAX} characters or fewer.`,
    };
  }
  return null;
}

export function validateDescription(description: string): BoardFieldError | null {
  if (countChars(description) > BOARD_DESCRIPTION_MAX) {
    return {
      field: "description",
      message: `Description must be ${BOARD_DESCRIPTION_MAX} characters or fewer.`,
    };
  }
  return null;
}

/**
 * Client-side title inspection for live form feedback. Uses the same
 * normalization and code-point counting as the server, so the on-screen
 * counter and `validateTitle` never disagree.
 */
export function inspectTitle(raw: string): {
  /** code-point length of the title as it will be stored */
  count: number;
  tooLong: boolean;
  empty: boolean;
} {
  const normalized = normalizeTitle(raw);
  const count = countChars(normalized);
  return { count, tooLong: count > BOARD_TITLE_MAX, empty: count < 1 };
}
