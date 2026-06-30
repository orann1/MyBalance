import { PublicDataSource } from "@prisma/client";
import { parseNumeric, parseReportPeriod, parseSourceDateTime, parseString } from "./parsing";
import type { RawPublicFundRecord } from "./types";

// Required core fields — a row missing any of these is skipped rather than
// crashing the whole sync. See Context/Algorithms/pension-return-calculation.md
// and the Phase 2C-2 implementation prompt for the data quality rules.
const REQUIRED_FIELDS = [
  "FUND_ID",
  "FUND_NAME",
  "MANAGING_CORPORATION",
  "REPORT_PERIOD",
  "MONTHLY_YIELD",
  "YEAR_TO_DATE_YIELD",
] as const;

export interface NormalizedPublicFund {
  source: PublicDataSource;
  fundId: string;
  fundName: string;
  managingCompany: string;
  managingCompanyLegalId: string | null;
  controllingCorporation: string | null;
  parentCompanyId: string | null;
  parentCompanyName: string | null;
  fundClassification: string | null;
  specialization: string | null;
  subSpecialization: string | null;
  targetPopulation: string | null;
  inceptionDate: Date | null;
}

export interface NormalizedFundReturn {
  reportPeriod: Date;
  monthlyReturn: number;
  ytdReturn: number;
  trailing3YrReturn: number | null;
  trailing5YrReturn: number | null;
  annualized3YrReturn: number | null;
  annualized5YrReturn: number | null;
  // AUM units are not display-approved yet (see Context/data-model.md). The raw
  // value is preserved alongside a best-effort numeric parse, but neither
  // should be presented in the UI as a confirmed unit.
  assetsUnderManagement: number | null;
  assetsUnderManagementRaw: string | null;
  avgAnnualManagementFee: number | null;
  avgDepositFee: number | null;
  sourceResourceId: string;
  sourceSnapshotDate: Date | null;
}

export interface NormalizedPublicFundRecord {
  fund: NormalizedPublicFund;
  fundReturn: NormalizedFundReturn;
}

export type NormalizeResult =
  | { ok: true; data: NormalizedPublicFundRecord }
  | { ok: false; reason: string };

/**
 * Normalizes a single raw GemelNet or PensionNet row into PublicFund/FundReturn
 * shapes. GemelNet and PensionNet share this single function — the two sources
 * only branch where their field sets actually differ (PARENT_COMPANY_*,
 * TARGET_POPULATION/SPECIALIZATION/SUB_SPECIALIZATION).
 *
 * Does not infer `productType` — that stays unknown/null in this phase
 * (see Context/data-model.md, PublicFundProductType).
 */
export function normalizePublicFundRecord(
  source: PublicDataSource,
  raw: RawPublicFundRecord,
  resourceId: string,
): NormalizeResult {
  const fundId = parseString(raw.FUND_ID);
  const fundName = parseString(raw.FUND_NAME);
  const managingCompany = parseString(raw.MANAGING_CORPORATION);
  const reportPeriod = parseReportPeriod(raw.REPORT_PERIOD);
  const monthlyReturn = parseNumeric(raw.MONTHLY_YIELD);
  const ytdReturn = parseNumeric(raw.YEAR_TO_DATE_YIELD);

  if (!fundId) return { ok: false, reason: `missing ${REQUIRED_FIELDS[0]}` };
  if (!fundName) return { ok: false, reason: `missing ${REQUIRED_FIELDS[1]}` };
  if (!managingCompany) return { ok: false, reason: `missing ${REQUIRED_FIELDS[2]}` };
  if (!reportPeriod) return { ok: false, reason: `missing/invalid ${REQUIRED_FIELDS[3]}` };
  if (monthlyReturn === null) return { ok: false, reason: `missing ${REQUIRED_FIELDS[4]}` };
  if (ytdReturn === null) return { ok: false, reason: `missing ${REQUIRED_FIELDS[5]}` };

  const isPensionNet = source === PublicDataSource.pensionnet;

  // PensionNet-only fields.
  const parentCompanyId = isPensionNet ? parseString(raw.PARENT_COMPANY_ID) : null;
  const parentCompanyName = isPensionNet ? parseString(raw.PARENT_COMPANY_NAME) : null;

  // GemelNet-only fields.
  const targetPopulation = isPensionNet ? null : parseString(raw.TARGET_POPULATION);
  const specialization = isPensionNet ? null : parseString(raw.SPECIALIZATION);
  const subSpecialization = isPensionNet ? null : parseString(raw.SUB_SPECIALIZATION);

  const totalAssetsRaw = raw.TOTAL_ASSETS;

  return {
    ok: true,
    data: {
      fund: {
        source,
        fundId,
        fundName,
        managingCompany,
        managingCompanyLegalId: parseString(raw.MANAGING_CORPORATION_LEGAL_ID),
        controllingCorporation: parseString(raw.CONTROLLING_CORPORATION),
        parentCompanyId,
        parentCompanyName,
        fundClassification: parseString(raw.FUND_CLASSIFICATION),
        specialization,
        subSpecialization,
        targetPopulation,
        inceptionDate: parseSourceDateTime(raw.INCEPTION_DATE),
      },
      fundReturn: {
        reportPeriod,
        monthlyReturn,
        ytdReturn,
        trailing3YrReturn: parseNumeric(raw.YIELD_TRAILING_3_YRS),
        trailing5YrReturn: parseNumeric(raw.YIELD_TRAILING_5_YRS),
        annualized3YrReturn: parseNumeric(raw.AVG_ANNUAL_YIELD_TRAILING_3YRS),
        annualized5YrReturn: parseNumeric(raw.AVG_ANNUAL_YIELD_TRAILING_5YRS),
        assetsUnderManagement: parseNumeric(totalAssetsRaw),
        assetsUnderManagementRaw:
          totalAssetsRaw === null || totalAssetsRaw === undefined ? null : String(totalAssetsRaw),
        avgAnnualManagementFee: parseNumeric(raw.AVG_ANNUAL_MANAGEMENT_FEE),
        avgDepositFee: parseNumeric(raw.AVG_DEPOSIT_FEE),
        sourceResourceId: resourceId,
        sourceSnapshotDate: parseSourceDateTime(raw.CURRENT_DATE),
      },
    },
  };
}
