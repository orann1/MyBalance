"use server";

import { PublicDataSource, PublicFundProductType } from "@prisma/client";
import { searchPublicFundsForMatching } from "@/lib/public-funds/search-public-funds";
import { PublicFundSearchSchema } from "@/lib/validation/public-fund-matching";
import type { PublicFundMatchCandidate } from "@/lib/public-funds/search-types";

export type PublicFundSearchActionResult =
  | { ok: true; candidates: PublicFundMatchCandidate[] }
  | { ok: false; error: "validation" | "server_error" };

/**
 * Server action for Phase 2C-3A: searches local PublicFund records as
 * candidates for future matching to a ManagedSavingsHolding. Does not link
 * or modify any holding. Local DB only — never calls Data.gov.il.
 */
export async function searchPublicFundsForMatchingAction(
  raw: unknown,
): Promise<PublicFundSearchActionResult> {
  const parsed = PublicFundSearchSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const candidates = await searchPublicFundsForMatching({
      query: parsed.data.query,
      source: parsed.data.source as PublicDataSource | undefined,
      productType: parsed.data.productType as PublicFundProductType | undefined,
      managingCompany: parsed.data.managingCompany,
      fundId: parsed.data.fundId,
      limit: parsed.data.limit,
    });
    return { ok: true, candidates };
  } catch {
    return { ok: false, error: "server_error" };
  }
}
