// Safe parsing helpers for raw Data.gov.il field values. All return `null`
// instead of throwing — bad individual fields should not crash a sync row.

/** Parses a numeric field that may arrive as a number, numeric string, or null. */
export function parseNumeric(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/** Parses a non-empty trimmed string, or null. */
export function parseString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

/**
 * Parses REPORT_PERIOD (format `YYYYMM`, e.g. 202401) into the first day of
 * that month (UTC). Returns null if the value is missing or malformed.
 */
export function parseReportPeriod(value: unknown): Date | null {
  const num = parseNumeric(value);
  if (num === null) return null;

  const digits = String(Math.trunc(num));
  if (digits.length !== 6) return null;

  const year = Number(digits.slice(0, 4));
  const month = Number(digits.slice(4, 6));
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, 1));
}

/**
 * Parses a Data.gov.il datetime string (format `YYYY-MM-DD HH:MM:SS`) into a
 * Date. Returns null if missing or unparseable.
 */
export function parseSourceDateTime(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  const isoLike = trimmed.includes("T") ? trimmed : trimmed.replace(" ", "T");
  const date = new Date(isoLike);
  return Number.isNaN(date.getTime()) ? null : date;
}
