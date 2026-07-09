import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

// Conservative, display-only helper for shortening Israeli company legal
// suffixes (e.g. "בע\"מ" and its quote-character variants) in compact UI
// contexts such as the main holdings table. Never mutates stored data —
// only affects what is rendered.
//
// Intentionally limited to trimming the trailing legal-entity suffix.
// Further brand-name extraction (e.g. "אנליסט קופות גמל בע\"מ" -> "אנליסט")
// would require a hardcoded company-name lookup table to do safely and was
// judged too risky/fragile for a display helper — skipped per guidance to
// prefer the full name over a risky shortening.
const LEGAL_SUFFIX_PATTERN = /\s*בע["'׳״]מ\.?\s*$/;

export function formatCompanyNameForTable(name: string): string {
  const cleaned = name.replace(LEGAL_SUFFIX_PATTERN, "").trim();
  return cleaned || name;
}

export interface CompanyDisplay {
  primary: string;
  secondary: string;
}

/**
 * Resolves the company/track display pair for the main holdings table.
 * Linked holdings prefer the linked public fund's identity (managing
 * company + fund name) over the manually-entered holding fields, since the
 * public fund record is the more reliable source once a link is confirmed.
 * Unlinked holdings keep using the manually-entered managingCompany/track.
 */
export function getCompanyDisplay(investment: ManagedSavingsInvestment): CompanyDisplay {
  if (investment.linkedPublicFund) {
    return {
      primary: investment.linkedPublicFund.managingCompany,
      secondary: investment.linkedPublicFund.fundName,
    };
  }
  return {
    primary: investment.managingCompany,
    secondary: investment.track,
  };
}
