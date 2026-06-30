// Local string normalization helpers for public fund matching search.
//
// These helpers are for matching/comparison only — they never mutate or
// overwrite stored DB values, and their output must never be used as a
// display value.

// Hebrew geresh/gershayim variants and common quote characters that appear
// interchangeably in fund/company names (e.g. אי.די.איי / אי"די"איי).
const QUOTE_LIKE_CHARS = /['"׳״`´]/g;

// Common punctuation noise that doesn't carry matching signal.
const PUNCTUATION_NOISE = /[.,()\-_/\\]/g;

const WHITESPACE_RUN = /\s+/g;

/**
 * Normalizes a string for matching comparisons: trims, collapses whitespace,
 * strips quote-like and punctuation noise, and lowercases Latin characters.
 * Does not transliterate or otherwise change Hebrew letters themselves.
 */
export function normalizeForMatching(value: string | null | undefined): string {
  if (!value) return "";

  return value
    .trim()
    .replace(QUOTE_LIKE_CHARS, "")
    .replace(PUNCTUATION_NOISE, " ")
    .replace(WHITESPACE_RUN, " ")
    .trim()
    .toLowerCase();
}

/**
 * Splits a normalized string into matching tokens (words), dropping empties.
 */
export function tokenizeForMatching(value: string | null | undefined): string[] {
  const normalized = normalizeForMatching(value);
  if (!normalized) return [];
  return normalized.split(" ").filter(Boolean);
}

/**
 * True if `a` and `b` are equal after normalization.
 */
export function isNormalizedEqual(a: string | null | undefined, b: string | null | undefined): boolean {
  const normA = normalizeForMatching(a);
  const normB = normalizeForMatching(b);
  return normA.length > 0 && normA === normB;
}

/**
 * True if normalized `haystack` contains normalized `needle`.
 */
export function normalizedContains(
  haystack: string | null | undefined,
  needle: string | null | undefined,
): boolean {
  const normHaystack = normalizeForMatching(haystack);
  const normNeedle = normalizeForMatching(needle);
  return normNeedle.length > 0 && normHaystack.includes(normNeedle);
}

/**
 * Trims a raw user-supplied string input, collapsing internal whitespace
 * runs, without altering case or stripping punctuation. Used for normalizing
 * search input fields before they are used in DB queries or stored as
 * search-result metadata (where altering case/punctuation would be wrong).
 */
export function trimAndCollapseWhitespace(value: string | null | undefined): string {
  if (!value) return "";
  return value.trim().replace(WHITESPACE_RUN, " ");
}
