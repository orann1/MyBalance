// Raw GemelNet/PensionNet record shapes as returned by `datastore_search`.
// Fields may be missing or null depending on source and reporting period —
// every field here is optional. Numeric/date fields arrive as CKAN-typed
// values (numeric fields may come back as `number`; dates as text strings
// like "2026-06-30 00:00:00") and must go through the safe parsing helpers
// in `parsing.ts` before use.

export interface RawPublicFundRecordBase {
  _id?: number;
  FUND_ID?: number | string | null;
  FUND_NAME?: string | null;
  FUND_CLASSIFICATION?: string | null;
  CONTROLLING_CORPORATION?: string | null;
  MANAGING_CORPORATION?: string | null;
  MANAGING_CORPORATION_LEGAL_ID?: number | string | null;
  REPORT_PERIOD?: number | string | null;
  INCEPTION_DATE?: string | null;
  TOTAL_ASSETS?: number | string | null;
  AVG_ANNUAL_MANAGEMENT_FEE?: number | string | null;
  AVG_DEPOSIT_FEE?: number | string | null;
  MONTHLY_YIELD?: number | string | null;
  YEAR_TO_DATE_YIELD?: number | string | null;
  YIELD_TRAILING_3_YRS?: number | string | null;
  YIELD_TRAILING_5_YRS?: number | string | null;
  AVG_ANNUAL_YIELD_TRAILING_3YRS?: number | string | null;
  AVG_ANNUAL_YIELD_TRAILING_5YRS?: number | string | null;
  CURRENT_DATE?: string | null;
  // Additional source fields exist (STANDARD_DEVIATION, ALPHA, SHARPE_RATIO,
  // exposure breakdowns, etc.) but are out of scope for Phase 2C-2 and are
  // intentionally not modeled here.
  [key: string]: unknown;
}

// GemelNet-only fields (Keren Hishtalmut / Kupat Gemel / Gemel LeHashkaa).
export interface RawGemelNetRecord extends RawPublicFundRecordBase {
  TARGET_POPULATION?: string | null;
  SPECIALIZATION?: string | null;
  SUB_SPECIALIZATION?: string | null;
}

// PensionNet-only fields.
export interface RawPensionNetRecord extends RawPublicFundRecordBase {
  PARENT_COMPANY_ID?: number | string | null;
  PARENT_COMPANY_NAME?: string | null;
  ACTUARIAL_ADJUSTMENT?: number | string | null;
}

export type RawPublicFundRecord = RawGemelNetRecord | RawPensionNetRecord;
