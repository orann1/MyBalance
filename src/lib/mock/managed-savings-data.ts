export interface ManagedSavingsInvestment {
  id: string;
  name: string;
  type: "hishtalmut" | "gemel" | "hashkaa" | "savings";
  managingCompany: string;
  track: string;
  currentBalance: number;
  monthlyContribution: number;
  accumulationFeePercent: number;
  depositFeePercent: number;
  owner: "self" | "spouse" | "child" | "shared" | "family" | "other";
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
    owner: "self",
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
    owner: "spouse",
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
    owner: "child",
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
    owner: "child",
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
    owner: "shared",
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
    owner: "family",
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
    owner: "self",
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
    owner: "shared",
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
 */
export function getEffectiveAnnualReturn(investment: ManagedSavingsInvestment): number {
  if (investment.linkedPublicFund?.latestAnnualized5YrReturn != null) {
    return investment.linkedPublicFund.latestAnnualized5YrReturn;
  }
  return investment.trackPerformance.last5Years;
}

export function projectSimulations(
  investment: ManagedSavingsInvestment,
  customYears: number
): Record<number, SimulationYear> {
  const today = new Date();
  const currentYear = today.getFullYear();
  const years = [0, 1, 5, 10, 15];

  if (customYears && customYears > 15) {
    years.push(customYears);
  }

  const results: Record<number, SimulationYear> = {};

  years.forEach((yearOffset) => {
    const year = currentYear + yearOffset;
    const monthsOfContribution = yearOffset * 12;
    const totalContributions =
      investment.currentBalance + investment.monthlyContribution * monthsOfContribution;

    // Annual return: prefer linked public fund 5Y annualized return, else mock fallback.
    // Divided by 100 to convert percent to decimal. Not the user's personal realized return.
    const baseGrowthRate = getEffectiveAnnualReturn(investment) / 100;
    const adjustedGrowthRate = baseGrowthRate - investment.accumulationFeePercent / 100;

    const projectedValue = Math.round(
      investment.currentBalance *
        Math.pow(1 + adjustedGrowthRate / 12, monthsOfContribution) +
        investment.monthlyContribution *
          (Math.pow(1 + adjustedGrowthRate / 12, monthsOfContribution) - 1) /
          (adjustedGrowthRate / 12)
    );

    const estimatedFees = Math.round(
      totalContributions * (investment.accumulationFeePercent / 100) * yearOffset || 0
    );
    const estimatedNetGain = projectedValue - totalContributions;

    const simulationYear: SimulationYear = {
      year,
      projectedValue,
      estimatedContributions: totalContributions,
      estimatedFees,
      estimatedNetGain,
    };

    results[yearOffset] = simulationYear;
  });

  return results;
}

export function calculateTotalSummary(
  investments: ManagedSavingsInvestment[],
  year: number
) {
  const byType = {
    hishtalmut: 0,
    gemel: 0,
    hashkaa: 0,
    savings: 0,
    total: 0,
  };

  investments.forEach((inv) => {
    const simulations = projectSimulations(inv, year);
    const yearData = simulations[Math.min(year, Math.max(...Object.keys(simulations).map(Number)))];
    if (yearData) {
      byType[inv.type] += yearData.projectedValue || 0;
      byType.total += yearData.projectedValue || 0;
    }
  });

  return byType;
}
