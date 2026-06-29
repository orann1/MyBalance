// Financial unit conversion utilities.
// All persisted money values use integer minor units (agorot for ILS).
// All persisted fee values use integer basis points (bps). 100 bps = 1%.

/**
 * Convert a major-unit currency amount (e.g., ILS) to minor units (agorot).
 * Uses Math.round to avoid floating-point artifacts.
 */
export function toMinorUnits(amount: number): bigint {
  return BigInt(Math.round(amount * 100));
}

/**
 * Convert minor units (agorot) back to major units (ILS).
 */
export function fromMinorUnits(minor: bigint): number {
  return Number(minor) / 100;
}

/**
 * Convert a percentage (e.g., 0.45 for 0.45%) to basis points.
 * Uses Math.round to avoid floating-point artifacts.
 */
export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

/**
 * Convert basis points back to a percentage value (e.g., 45 → 0.45).
 */
export function bpsToPercent(bps: number): number {
  return bps / 100;
}
