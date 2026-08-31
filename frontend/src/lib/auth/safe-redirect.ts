// Shared post-authentication redirect validation.
//
// `redirectTo` / `next` values arrive from query strings and hidden form fields,
// so they are attacker-controllable. This helper accepts only same-origin
// relative paths and falls back to `/dashboard` for anything else, closing the
// classic open-redirect / phishing vector (findings F1 and F8).

const DEFAULT_PATH = "/dashboard";

// A dummy origin used purely to resolve the candidate path. If `new URL` ends up
// on any other origin, the input was absolute or protocol-relative.
const RESOLVE_BASE = "https://redirect.invalid";

/** True if the string contains a space, a C0 control character, or DEL. */
function hasControlOrSpace(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x20 || code === 0x7f) return true;
  }
  return false;
}

/**
 * Return a safe same-origin relative path (path + query, no fragment), or
 * `fallback` when the input is missing, absolute, protocol-relative,
 * backslash-based, control-character laden, or otherwise malformed.
 */
export function safeRelativePath(
  target: unknown,
  fallback: string = DEFAULT_PATH,
): string {
  if (typeof target !== "string" || target.length === 0) return fallback;

  // Must be an absolute-path reference: exactly one leading slash.
  if (target[0] !== "/") return fallback;
  if (target[1] === "/" || target[1] === "\\") return fallback;

  // Browsers treat "\" as "/" in URLs; reject it anywhere so it cannot smuggle
  // a protocol-relative target past the checks above.
  if (target.includes("\\")) return fallback;

  // Percent-encoded slash/backslash never appears in a path this app generates
  // and is a classic way to sneak "//" or "/\" past a normaliser.
  if (/%2f|%5c/i.test(target)) return fallback;

  // URL parsers strip or reinterpret whitespace / control characters.
  if (hasControlOrSpace(target)) return fallback;

  let url: URL;
  try {
    url = new URL(target, RESOLVE_BASE);
  } catch {
    return fallback;
  }

  // Absolute or protocol-relative inputs resolve to a different origin.
  if (url.origin !== RESOLVE_BASE) return fallback;

  const path = `${url.pathname}${url.search}`;
  if (path[0] !== "/" || path[1] === "/") return fallback;

  return path;
}
