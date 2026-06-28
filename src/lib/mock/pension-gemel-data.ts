export interface PensionGemelInvestment {
  id: string;
  name: string;
  type: "pension" | "hishtalmut" | "gemel" | "savings";
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
  retirementAge?: number;
  pensionConversionFactor?: number;
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
  estimatedMonthlyPension?: number;
}

const pensionGemelInvestments: PensionGemelInvestment[] = [
  {
    id: "pen-001",
    name: "פנסיה - ביטוח מנהלים",
    type: "pension",
    managingCompany: "הפניקס",
    track: "טראק ממוצע",
    currentBalance: 485000,
    monthlyContribution: 1200,
    accumulationFeePercent: 0.52,
    depositFeePercent: 0.0,
    owner: "self",
    lastUpdateDate: "2026-06-20",
    status: "active",
    officialFundId: "PHX-0001",
    retirementAge: 67,
    pensionConversionFactor: 8.5,
  },
  {
    id: "pen-002",
    name: "פנסיה - ביטוח מנהלים - בן זוג",
    type: "pension",
    managingCompany: "הפניקס",
    track: "טראק ממוצע",
    currentBalance: 420000,
    monthlyContribution: 1100,
    accumulationFeePercent: 0.52,
    depositFeePercent: 0.0,
    owner: "spouse",
    lastUpdateDate: "2026-06-20",
    status: "active",
    officialFundId: "PHX-0001",
    retirementAge: 62,
    pensionConversionFactor: 8.2,
  },
  {
    id: "hist-001",
    name: "קרן השתלמות",
    type: "hishtalmut",
    managingCompany: "בנק לאומי",
    track: "קרן עו״ש ממוצעת",
    currentBalance: 185000,
    monthlyContribution: 550,
    accumulationFeePercent: 0.45,
    depositFeePercent: 0.0,
    owner: "self",
    lastUpdateDate: "2026-06-18",
    status: "active",
  },
  {
    id: "gemel-001",
    name: "קופת גמל לפיצויים",
    type: "gemel",
    managingCompany: "הבנק הבינלאומי",
    track: "קופת גמל ממוצעת",
    currentBalance: 125000,
    monthlyContribution: 350,
    accumulationFeePercent: 0.38,
    depositFeePercent: 0.0,
    owner: "self",
    lastUpdateDate: "2026-06-15",
    status: "active",
  },
  {
    id: "hash-001",
    name: "גמל להשקעה",
    type: "savings",
    managingCompany: "בנק דיסקונט",
    track: "קרן אפיקים גמל להשקעה",
    currentBalance: 95000,
    monthlyContribution: 300,
    accumulationFeePercent: 0.65,
    depositFeePercent: 0.0,
    owner: "self",
    lastUpdateDate: "2026-06-12",
    status: "active",
  },
];

const trackPerformance: Record<string, TrackPerformance> = {
  "PHX-0001": {
    lastMonth: 1.2,
    last1Year: 8.5,
    last3Years: 6.2,
    last5Years: 5.8,
    last10Years: 6.1,
  },
  "הקרן הממוצעת": {
    lastMonth: 0.95,
    last1Year: 7.2,
    last3Years: 5.4,
    last5Years: 5.1,
    last10Years: 5.3,
  },
};

export function getMockPensionGemelData() {
  return pensionGemelInvestments;
}

export function getTrackPerformance(fundId: string): TrackPerformance {
  return (
    trackPerformance[fundId] || {
      lastMonth: 0.8,
      last1Year: 6.5,
      last3Years: 5.0,
      last5Years: 4.8,
      last10Years: 5.0,
    }
  );
}

export function projectSimulations(
  investment: PensionGemelInvestment,
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

    // Simplified compound growth: assume average 6% annual return
    const baseGrowthRate = 0.06;
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
      ...(investment.type === "pension" && investment.pensionConversionFactor
        ? {
            estimatedMonthlyPension: Math.round(
              (projectedValue / investment.pensionConversionFactor) * 1000
            ),
          }
        : {}),
    };

    results[yearOffset] = simulationYear;
  });

  return results;
}

export function calculateTotalSummary(investments: PensionGemelInvestment[], year: number) {
  const byType = {
    pension: 0,
    hishtalmut: 0,
    gemel: 0,
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

export function calculatePensionMonthlyPension(
  investments: PensionGemelInvestment[],
  year: number
): number {
  let totalMonthlyPension = 0;

  investments
    .filter((inv) => inv.type === "pension" && inv.pensionConversionFactor)
    .forEach((inv) => {
      const simulations = projectSimulations(inv, year);
      const yearData = simulations[Math.min(year, Math.max(...Object.keys(simulations).map(Number)))];
      if (yearData && yearData.estimatedMonthlyPension) {
        totalMonthlyPension += yearData.estimatedMonthlyPension;
      }
    });

  return totalMonthlyPension;
}
