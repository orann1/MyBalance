import type { Prisma, PublicFund } from "@prisma/client";
import { prisma } from "../db/prisma";
import { trimAndCollapseWhitespace } from "./matching-normalization";
import { scorePublicFundCandidate } from "./matching";
import { getLatestFundReturnSummaries } from "./latest-fund-returns";
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_CANDIDATE_POOL,
  MAX_SEARCH_LIMIT,
  type PublicFundMatchCandidate,
  type PublicFundSearchInput,
} from "./search-types";

function clampLimit(limit: number | undefined): number {
  if (!limit || !Number.isFinite(limit) || limit <= 0) return DEFAULT_SEARCH_LIMIT;
  return Math.min(Math.floor(limit), MAX_SEARCH_LIMIT);
}

interface NormalizedSearchInput {
  query: string;
  source?: PublicFundSearchInput["source"];
  productType?: PublicFundSearchInput["productType"];
  managingCompany: string;
  fundId: string;
  limit: number;
}

function normalizeInput(input: PublicFundSearchInput): NormalizedSearchInput {
  return {
    query: trimAndCollapseWhitespace(input.query),
    source: input.source,
    productType: input.productType,
    managingCompany: trimAndCollapseWhitespace(input.managingCompany),
    fundId: input.fundId !== undefined && input.fundId !== null ? String(input.fundId).trim() : "",
    limit: clampLimit(input.limit),
  };
}

/**
 * Searches local PublicFund records for candidates matching the given input.
 * Local DB only — never calls Data.gov.il. Does not modify any data and does
 * not read or write ManagedSavingsHolding.
 */
export async function searchPublicFundsForMatching(
  rawInput: PublicFundSearchInput,
): Promise<PublicFundMatchCandidate[]> {
  const input = normalizeInput(rawInput);

  if (!input.query && !input.fundId) {
    return [];
  }

  const candidateFunds = new Map<string, PublicFund>();

  if (input.fundId) {
    const exactMatches = await prisma.publicFund.findMany({
      where: {
        fundId: input.fundId,
        ...(input.source ? { source: input.source } : {}),
      },
    });
    for (const fund of exactMatches) {
      candidateFunds.set(fund.id, fund);
    }
  }

  // Only run the broad text query if a query string was supplied, or if the
  // fundId exact match found nothing and a query exists to fall back on.
  if (input.query) {
    const textWhere: Prisma.PublicFundWhereInput = {
      OR: [
        { fundName: { contains: input.query, mode: "insensitive" } },
        { managingCompany: { contains: input.query, mode: "insensitive" } },
        { controllingCorporation: { contains: input.query, mode: "insensitive" } },
        { parentCompanyName: { contains: input.query, mode: "insensitive" } },
      ],
      ...(input.source ? { source: input.source } : {}),
      ...(input.managingCompany
        ? { managingCompany: { contains: input.managingCompany, mode: "insensitive" } }
        : {}),
      // productType is mostly unknown/null — only filter when explicitly supplied.
      ...(input.productType ? { productType: input.productType } : {}),
    };

    const textMatches = await prisma.publicFund.findMany({
      where: textWhere,
      take: MAX_CANDIDATE_POOL,
    });
    for (const fund of textMatches) {
      candidateFunds.set(fund.id, fund);
    }
  }

  if (candidateFunds.size === 0) {
    return [];
  }

  // Batched, bounded lookup — exactly one (latest) FundReturn row per fund,
  // regardless of how many months of history each candidate fund has.
  const fundIds = Array.from(candidateFunds.keys());
  const latestSummaries = await getLatestFundReturnSummaries(fundIds);

  const candidates: PublicFundMatchCandidate[] = [];

  for (const fund of candidateFunds.values()) {
    const latestSummary = latestSummaries.get(fund.id) ?? null;

    const { score, reasons } = scorePublicFundCandidate(
      fund,
      {
        query: input.query || undefined,
        source: input.source,
        productType: input.productType,
        managingCompany: input.managingCompany || undefined,
        fundId: input.fundId || undefined,
      },
      latestSummary !== null,
    );

    candidates.push({
      publicFundId: fund.id,
      source: fund.source,
      fundId: fund.fundId,
      fundName: fund.fundName,
      managingCompany: fund.managingCompany,
      controllingCorporation: fund.controllingCorporation,
      parentCompanyName: fund.parentCompanyName,
      productType: fund.productType,
      fundClassification: fund.fundClassification,
      specialization: fund.specialization,
      subSpecialization: fund.subSpecialization,
      latestReportPeriod: latestSummary?.reportPeriod ?? null,
      latestMonthlyReturn: latestSummary?.monthlyReturn ?? null,
      latestYtdReturn: latestSummary?.ytdReturn ?? null,
      latestAnnualized3YrReturn: latestSummary?.annualized3YrReturn ?? null,
      latestAnnualized5YrReturn: latestSummary?.annualized5YrReturn ?? null,
      matchScore: score,
      matchReasonLabels: reasons,
    });
  }

  candidates.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;

    const aPeriod = a.latestReportPeriod?.getTime() ?? 0;
    const bPeriod = b.latestReportPeriod?.getTime() ?? 0;
    if (bPeriod !== aPeriod) return bPeriod - aPeriod;

    return a.fundName.localeCompare(b.fundName);
  });

  return candidates.slice(0, input.limit);
}
