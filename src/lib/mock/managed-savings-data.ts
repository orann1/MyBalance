export interface ManagedSavingsInvestment {
  id: string;
  name: string;
  type: "hishtalmut" | "gemel" | "hashkaa" | "savings" | "other";
  managingCompany: string;
  track: string;
  currentBalance: number;
  monthlyContribution: number;
  accumulationFeePercent: number;
  depositFeePercent: number;
  // Free-text ownership label (Phase 2D-2A) — separate from group membership.
  // Replaces the old fixed OwnerLabel enum; never derived/translated.
  ownershipLabel: string;
  // Every holding belongs to exactly one user-defined group (Phase 2D-2A).
  groupId: string;
  lastUpdateDate: string;
  status: "active" | "inactive";
  officialFundId?: string;
  trackPerformance: TrackPerformance;
  // Personal notes — displayed in expanded row only, not in the main table.
  notes?: string;
  // Phase 2C-3B: user-confirmed link to a public GemelNet/PensionNet fund.
  // Identity only — never AUM, never the full FundReturn history, never
  // presented as the user's personal return.
  linkedPublicFund?: LinkedPublicFund | null;
}

export interface LinkedPublicFund {
  id: string;
  source: "gemelnet" | "pensionnet";
  fundId: string;
  fundName: string;
  managingCompany: string;
  latestReportPeriod?: string;
  // Phase 2C-3B UX: latest public return metrics for the linked fund.
  // Public fund-level only — never the user's personal return.
  latestMonthlyReturn?: number | null;
  latestYtdReturn?: number | null;
  latestAnnualized3YrReturn?: number | null;
  latestAnnualized5YrReturn?: number | null;
}

export interface TrackPerformance {
  lastMonth: number;
  last1Year: number;
  last3Years: number;
  last5Years: number;
  last10Years?: number;
}

export interface SimulationYear {
  year: number;
  projectedValue: number;
  estimatedContributions: number;
  estimatedFees: number;
  estimatedNetGain: number;
}

// Mock-only placeholder group id — this array is historical seed reference
// data, not part of any live display path (see getMockManagedSavingsData).
const MOCK_DEFAULT_GROUP_ID = "mock-group-default";

const managedSavingsInvestments: ManagedSavingsInvestment[] = [
  {
    id: "hist-001",
    name: "קרן השתלמות שלי",
    type: "hishtalmut",
    managingCompany: "בנק לאומי",
    track: "קרן עו״ש ממוצעת",
    currentBalance: 285000,
    monthlyContribution: 650,
    accumulationFeePercent: 0.45,
    depositFeePercent: 0.0,
    ownershipLabel: "עצמי",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-27",
    status: "active",
    officialFundId: "BL-UH-0045",
    trackPerformance: {
      lastMonth: 0.95,
      last1Year: 7.2,
      last3Years: 5.4,
      last5Years: 5.1,
      last10Years: 5.3,
    },
  },
  {
    id: "hist-002",
    name: "קרן השתלמות אשתי",
    type: "hishtalmut",
    managingCompany: "בנק דיסקונט",
    track: "קרן עו״ש ממוצעת",
    currentBalance: 265000,
    monthlyContribution: 600,
    accumulationFeePercent: 0.48,
    depositFeePercent: 0.0,
    ownershipLabel: "בן/בת זוג",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-27",
    status: "active",
    officialFundId: "BD-UH-0048",
    trackPerformance: {
      lastMonth: 0.92,
      last1Year: 7.0,
      last3Years: 5.2,
      last5Years: 5.0,
      last10Years: 5.2,
    },
  },
  {
    id: "gemel-001",
    name: "קופת גמל - ילד 1",
    type: "gemel",
    managingCompany: "הבנק הבינלאומי",
    track: "קופת גמל ממוצעת",
    currentBalance: 75000,
    monthlyContribution: 200,
    accumulationFeePercent: 0.38,
    depositFeePercent: 0.0,
    ownershipLabel: "ילד/ה",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-26",
    status: "active",
    officialFundId: "IB-GEMEL-0038",
    trackPerformance: {
      lastMonth: 0.88,
      last1Year: 6.8,
      last3Years: 5.0,
      last5Years: 4.9,
      last10Years: 5.1,
    },
  },
  {
    id: "gemel-002",
    name: "קופת גמל - ילד 2",
    type: "gemel",
    managingCompany: "הבנק הבינלאומי",
    track: "קופת גמל ממוצעת",
    currentBalance: 68000,
    monthlyContribution: 175,
    accumulationFeePercent: 0.38,
    depositFeePercent: 0.0,
    ownershipLabel: "ילד/ה",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-26",
    status: "active",
    officialFundId: "IB-GEMEL-0038",
    trackPerformance: {
      lastMonth: 0.88,
      last1Year: 6.8,
      last3Years: 5.0,
      last5Years: 4.9,
      last10Years: 5.1,
    },
  },
  {
    id: "hash-001",
    name: "גמל להשקעה משפחתי",
    type: "hashkaa",
    managingCompany: "בנק דיסקונט",
    track: "קרן אפיקים גמל להשקעה",
    currentBalance: 145000,
    monthlyContribution: 400,
    accumulationFeePercent: 0.65,
    depositFeePercent: 0.0,
    ownershipLabel: "משותף",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-25",
    status: "active",
    officialFundId: "BD-HASH-0065",
    trackPerformance: {
      lastMonth: 1.2,
      last1Year: 8.5,
      last3Years: 6.2,
      last5Years: 5.8,
      last10Years: 6.1,
    },
  },
  {
    id: "save-001",
    name: "פוליסת חיסכון ילדים",
    type: "savings",
    managingCompany: "הפניקס",
    track: "פוליסה משתנה",
    currentBalance: 92000,
    monthlyContribution: 400,
    accumulationFeePercent: 0.8,
    depositFeePercent: 0.0,
    ownershipLabel: "משפחה",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-23",
    status: "active",
    officialFundId: "PHX-SAVE-0080",
    trackPerformance: {
      lastMonth: 0.7,
      last1Year: 5.5,
      last3Years: 4.2,
      last5Years: 4.0,
      last10Years: 4.5,
    },
  },
  {
    id: "gemel-003",
    name: "קופת גמל שלי",
    type: "gemel",
    managingCompany: "הפניקס",
    track: "קופת גמל ממוצעת",
    currentBalance: 125000,
    monthlyContribution: 350,
    accumulationFeePercent: 0.40,
    depositFeePercent: 0.0,
    ownershipLabel: "עצמי",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-27",
    status: "active",
    officialFundId: "PHX-GEMEL-0040",
    trackPerformance: {
      lastMonth: 0.91,
      last1Year: 6.9,
      last3Years: 5.1,
      last5Years: 5.0,
      last10Years: 5.2,
    },
  },
  {
    id: "save-002",
    name: "חיסכון מנוהל משותף",
    type: "savings",
    managingCompany: "בנק לאומי",
    track: "קרן השקעה משתנה",
    currentBalance: 85000,
    monthlyContribution: 300,
    accumulationFeePercent: 0.75,
    depositFeePercent: 0.0,
    ownershipLabel: "משותף",
    groupId: MOCK_DEFAULT_GROUP_ID,
    lastUpdateDate: "2026-06-22",
    status: "active",
    officialFundId: "BL-SAVE-0075",
    trackPerformance: {
      lastMonth: 0.8,
      last1Year: 6.0,
      last3Years: 4.5,
      last5Years: 4.3,
      last10Years: 4.8,
    },
  },
];

export function getMockManagedSavingsData() {
  return managedSavingsInvestments;
}

export function getTrackPerformance(investment: ManagedSavingsInvestment): TrackPerformance {
  return investment.trackPerformance;
}

/**
 * Returns the effective annual return rate (as a percent, e.g. 13.54) for
 * display and projection purposes.
 *
 * Priority:
 *   1. linkedPublicFund.latestAnnualized5YrReturn — public fund-level data, not
 *      the user's personal return. Used as a projection assumption only.
 *   2. trackPerformance.last5Years — mock/fallback value.
 *
 * Kept for mock/demo contexts only — no longer called by any live display
 * path. The live DB-backed Managed Savings table/KPI/totals display must use
 * `getDisplayAnnualReturn` (historical percentage, never a mock fallback) and
 * `getProjectionAnnualReturn`/`projectWithAvailableReturnOrZero` (projection
 * assumption, 0% when no linked return exists) instead.
 */
export function getEffectiveAnnualReturn(investment: ManagedSavingsInvestment): number {
  if (investment.linkedPublicFund?.latestAnnualized5YrReturn != null) {
    return investment.linkedPublicFund.latestAnnualized5YrReturn;
  }
  return investment.trackPerformance.last5Years;
}

/**
 * Strict historical/display annual return rate (percent, e.g. 13.54). Returns
 * null when the holding is not linked to a public fund, or the linked fund
 * has no `latestAnnualized5YrReturn` — callers must render "—" in that case,
 * never a mock/default percentage (Phase 2D-1 QA fix). This is for the
 * "5-Year Return" display column only — it must not be confused with the
 * projection assumption, which is allowed to use 0% (see
 * `getProjectionAnnualReturn`).
 */
export function getDisplayAnnualReturn(investment: ManagedSavingsInvestment): number | null {
  return investment.linkedPublicFund?.latestAnnualized5YrReturn ?? null;
}

/**
 * Annual return rate (percent) that conceptually backs the projection
 * assumption. Never null and never a mock/default value:
 *   - linked holding with a real `latestAnnualized5YrReturn` — use it.
 *   - otherwise — 0, a transparent "no growth assumed" projection, not a
 *     historical return (Product Owner clarification, 2026-07-09: hiding the
 *     projection amount entirely was incorrect; the projection must still
 *     show current balance + contributions with no return applied).
 *
 * `projectWithAvailableReturnOrZero` does not feed this value through the
 * fee-adjusted compounding formula when it's the 0% case — see
 * `runZeroReturnProjection` — because subtracting the accumulation fee from
 * a 0% assumption would incorrectly shrink a holding with no contributions
 * below its current balance. This function exists for semantic clarity/reuse
 * (e.g. display of the assumed rate itself), not as runProjection's input.
 */
export function getProjectionAnnualReturn(investment: ManagedSavingsInvestment): number {
  return investment.linkedPublicFund?.latestAnnualized5YrReturn ?? 0;
}

function projectionYearOffsets(customYears: number): number[] {
  const years = [0, 1, 5, 10, 15];
  // Any custom horizon not already covered by the baseline points must be
  // computed too — previously this only ran for customYears > 15, silently
  // returning no data (0) for values like 12 that are now the common case
  // since the table's dynamic projection column defaults to 15.
  if (customYears && !years.includes(customYears)) {
    years.push(customYears);
  }
  return years;
}

// Shared compounding formula — used by both projectSimulations (mock/demo,
// may use the fallback rate) and the linked branch of
// projectWithAvailableReturnOrZero (live display). Only the source of
// `annualReturnPercent` differs between callers; the math itself must stay
// identical either way.
function runProjection(
  investment: ManagedSavingsInvestment,
  years: number[],
  annualReturnPercent: number
): Record<number, SimulationYear> {
  const today = new Date();
  const currentYear = today.getFullYear();
  const results: Record<number, SimulationYear> = {};

  years.forEach((yearOffset) => {
    const year = currentYear + yearOffset;
    const monthsOfContribution = yearOffset * 12;
    const totalContributions =
      investment.currentBalance + investment.monthlyContribution * monthsOfContribution;

    const baseGrowthRate = annualReturnPercent / 100;
    const adjustedGrowthRate = baseGrowthRate - investment.accumulationFeePercent / 100;
    const monthlyRate = adjustedGrowthRate / 12;

    // The annuity term below divides by monthlyRate — guard the case where
    // the annual return happens to exactly offset the accumulation fee
    // (adjustedGrowthRate === 0), which otherwise divides by zero. The
    // mathematical limit of the compounding formula as the rate approaches
    // zero is a flat linear sum of contributions, so that's the correct
    // value here too.
    const projectedValue =
      monthlyRate === 0
        ? Math.round(totalContributions)
        : Math.round(
            investment.currentBalance * Math.pow(1 + monthlyRate, monthsOfContribution) +
              (investment.monthlyContribution *
                (Math.pow(1 + monthlyRate, monthsOfContribution) - 1)) /
                monthlyRate
          );

    const estimatedFees = Math.round(
      totalContributions * (investment.accumulationFeePercent / 100) * yearOffset || 0
    );
    const estimatedNetGain = projectedValue - totalContributions;

    results[yearOffset] = {
      year,
      projectedValue,
      estimatedContributions: totalContributions,
      estimatedFees,
      estimatedNetGain,
    };
  });

  return results;
}

/**
 * Zero-return projection path — used when a holding has no linked return
 * data. Per Product Owner clarification (2026-07-09): the projection amount
 * must still be shown (current balance + accumulated monthly contributions),
 * with no investment return/growth applied and no accumulation-fee drag
 * (fees are a cost against real/assumed growth; with no growth assumed there
 * is nothing to charge a fee against). This guarantees, e.g., a holding with
 * 0 monthly contribution projects to exactly its current balance at every
 * horizon, regardless of its configured accumulationFeePercent.
 */
function runZeroReturnProjection(
  investment: ManagedSavingsInvestment,
  years: number[]
): Record<number, SimulationYear> {
  const today = new Date();
  const currentYear = today.getFullYear();
  const results: Record<number, SimulationYear> = {};

  years.forEach((yearOffset) => {
    const year = currentYear + yearOffset;
    const monthsOfContribution = yearOffset * 12;
    const totalContributions =
      investment.currentBalance + investment.monthlyContribution * monthsOfContribution;

    results[yearOffset] = {
      year,
      projectedValue: totalContributions,
      estimatedContributions: totalContributions,
      estimatedFees: 0,
      estimatedNetGain: 0,
    };
  });

  return results;
}

/** Mock/demo projection — may use the trackPerformance fallback rate. */
export function projectSimulations(
  investment: ManagedSavingsInvestment,
  customYears: number
): Record<number, SimulationYear> {
  return runProjection(investment, projectionYearOffsets(customYears), getEffectiveAnnualReturn(investment));
}

/**
 * Live-display projection. Always returns a result — never null and never a
 * mock/default rate:
 *   - linked holding with a real return — projects with that rate (unchanged
 *     compounding formula, fees applied as before).
 *   - no eligible linked return — projects with 0% annual return, so the
 *     result is current balance + accumulated monthly contributions, with no
 *     growth applied (Product Owner clarification, 2026-07-09: the amount
 *     must still be shown, not hidden).
 */
export function projectWithAvailableReturnOrZero(
  investment: ManagedSavingsInvestment,
  customYears: number
): Record<number, SimulationYear> {
  const years = projectionYearOffsets(customYears);
  const displayReturn = getDisplayAnnualReturn(investment);
  if (displayReturn == null) {
    return runZeroReturnProjection(investment, years);
  }
  return runProjection(investment, years, displayReturn);
}

/**
 * Aggregates projected value by holding type for a given year horizon. Used
 * by both the top KPI cards and the legacy "Future Projections" summary
 * table. Uses `projectWithAvailableReturnOrZero` — every active holding
 * contributes to the totals; holdings without a linked return contribute
 * their 0%-growth projected value (current balance + contributions), not
 * zero and not an exclusion (Phase 2D-1 zero-return-assumption fix).
 */
export function calculateTotalSummary(
  investments: ManagedSavingsInvestment[],
  year: number
) {
  const byType = {
    hishtalmut: 0,
    gemel: 0,
    hashkaa: 0,
    savings: 0,
    other: 0,
    total: 0,
  };

  investments.forEach((inv) => {
    const simulations = projectWithAvailableReturnOrZero(inv, year);
    const yearData = simulations[Math.min(year, Math.max(...Object.keys(simulations).map(Number)))];
    if (yearData) {
      byType[inv.type] += yearData.projectedValue || 0;
      byType.total += yearData.projectedValue || 0;
    }
  });

  return byType;
}
