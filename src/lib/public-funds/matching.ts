import type { PublicDataSource, PublicFund, PublicFundProductType } from "@prisma/client";
import {
  isNormalizedEqual,
  normalizedContains,
  tokenizeForMatching,
} from "./matching-normalization";
import type { MatchReasonLabel } from "./search-types";

// Deterministic scoring weights. Exact identifiers score highest; loose
// token overlap is a tie-breaker, not a primary driver.
const SCORE = {
  exactFundId: 1000,
  exactFundName: 500,
  fundNameContainsQuery: 200,
  queryContainsFundNameToken: 80,
  managingCompanyMatch: 120,
  controllingCorporationMatch: 60,
  parentCompanyMatch: 60,
  sourceMatch: 10,
  productTypeMatch: 30,
  hasRecentReturnData: 5,
} as const;

export interface ScoringInput {
  query?: string;
  source?: PublicDataSource;
  productType?: PublicFundProductType;
  managingCompany?: string;
  fundId?: string;
}

export interface ScoreResult {
  score: number;
  reasons: MatchReasonLabel[];
}

/**
 * Scores a PublicFund candidate against search input. Pure/deterministic —
 * no DB access. Intended to run over a bounded, already-fetched candidate
 * pool (see search-public-funds.ts).
 */
export function scorePublicFundCandidate(
  fund: Pick<
    PublicFund,
    | "fundId"
    | "fundName"
    | "managingCompany"
    | "controllingCorporation"
    | "parentCompanyName"
    | "source"
    | "productType"
  >,
  input: ScoringInput,
  hasRecentReturnData: boolean,
): ScoreResult {
  let score = 0;
  const reasons: MatchReasonLabel[] = [];

  if (input.fundId && fund.fundId === input.fundId) {
    score += SCORE.exactFundId;
    reasons.push("exact_fund_id");
  }

  if (input.query) {
    if (isNormalizedEqual(fund.fundName, input.query)) {
      score += SCORE.exactFundName;
      reasons.push("exact_fund_name");
    } else if (normalizedContains(fund.fundName, input.query)) {
      score += SCORE.fundNameContainsQuery;
      reasons.push("fund_name_contains_query");
    } else {
      const queryTokens = tokenizeForMatching(input.query);
      const fundNameTokens = tokenizeForMatching(fund.fundName);
      const hasTokenOverlap = queryTokens.some((qt) => fundNameTokens.includes(qt));
      if (hasTokenOverlap) {
        score += SCORE.queryContainsFundNameToken;
        reasons.push("query_contains_fund_name_token");
      }
    }

    if (
      normalizedContains(fund.managingCompany, input.query) ||
      isNormalizedEqual(fund.managingCompany, input.query)
    ) {
      score += SCORE.managingCompanyMatch;
      reasons.push("managing_company_match");
    }

    if (normalizedContains(fund.controllingCorporation, input.query)) {
      score += SCORE.controllingCorporationMatch;
      reasons.push("controlling_corporation_match");
    }

    if (normalizedContains(fund.parentCompanyName, input.query)) {
      score += SCORE.parentCompanyMatch;
      reasons.push("parent_company_match");
    }
  }

  if (
    input.managingCompany &&
    (normalizedContains(fund.managingCompany, input.managingCompany) ||
      isNormalizedEqual(fund.managingCompany, input.managingCompany)) &&
    !reasons.includes("managing_company_match")
  ) {
    score += SCORE.managingCompanyMatch;
    reasons.push("managing_company_match");
  }

  if (input.source && fund.source === input.source) {
    score += SCORE.sourceMatch;
    reasons.push("source_match");
  }

  if (input.productType && fund.productType && fund.productType === input.productType) {
    score += SCORE.productTypeMatch;
    reasons.push("product_type_match");
  }

  if (hasRecentReturnData) {
    score += SCORE.hasRecentReturnData;
    reasons.push("has_recent_return_data");
  }

  return { score, reasons };
}
