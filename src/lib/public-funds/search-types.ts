import type { PublicDataSource, PublicFundProductType } from "@prisma/client";

export const DEFAULT_SEARCH_LIMIT = 10;
export const MAX_SEARCH_LIMIT = 20;
// Bounded candidate pool pulled from the DB before in-memory scoring, to
// avoid loading the full PublicFund table for broad/short queries.
export const MAX_CANDIDATE_POOL = 200;

/**
 * Internal identifiers explaining why a candidate matched. Not user-facing
 * Hebrew/English text — a future UI layer is responsible for translating
 * these into copy.
 */
export type MatchReasonLabel =
  | "exact_fund_id"
  | "exact_fund_name"
  | "fund_name_contains_query"
  | "query_contains_fund_name_token"
  | "managing_company_match"
  | "controlling_corporation_match"
  | "parent_company_match"
  | "source_match"
  | "product_type_match"
  | "has_recent_return_data";

export interface PublicFundSearchInput {
  query?: string;
  source?: PublicDataSource;
  productType?: PublicFundProductType;
  managingCompany?: string;
  fundId?: string | number;
  limit?: number;
}

export interface PublicFundMatchCandidate {
  publicFundId: string;
  source: PublicDataSource;
  fundId: string;
  fundName: string;
  managingCompany: string;
  controllingCorporation: string | null;
  parentCompanyName: string | null;
  productType: PublicFundProductType | null;
  fundClassification: string | null;
  specialization: string | null;
  subSpecialization: string | null;
  latestReportPeriod: Date | null;
  latestMonthlyReturn: number | null;
  latestYtdReturn: number | null;
  latestAnnualized3YrReturn: number | null;
  latestAnnualized5YrReturn: number | null;
  matchScore: number;
  matchReasonLabels: MatchReasonLabel[];
}
