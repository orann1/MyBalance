import {
  projectWithAvailableReturnOrZero,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

export interface ManagedSavingsTypeBreakdown {
  type: ManagedSavingsInvestment["type"];
  count: number;
  totalBalance: number;
  totalMonthlyContribution: number;
  // Percent of the overall total balance (0-100). Null when total balance is 0.
  percentOfTotalBalance: number | null;
  linkedCount: number;
  unlinkedCount: number;
}

export interface ManagedSavingsSummary {
  totalBalance: number;
  totalMonthlyContributions: number;
  holdingsCount: number;
  linkedHoldingsCount: number;
  unlinkedHoldingsCount: number;
  linkedBalance: number;
  // Percent (0-100) of total balance held in linked holdings. Null when
  // total balance is 0 (avoids a meaningless division by zero).
  linkedBalanceCoveragePercent: number | null;
  // Balance-weighted average of linked funds' latestAnnualized5YrReturn,
  // percent value (e.g. 5.4). Only includes holdings that are linked, have a
  // non-null latestAnnualized5YrReturn, and have currentBalance > 0. Never
  // includes the mock/fallback trackPerformance value. Null when no eligible
  // linked holding exists — this is a public fund-level projection
  // assumption, not the user's personal realized return.
  weightedLinkedAnnualized5YrReturn: number | null;
  holdingsByType: ManagedSavingsTypeBreakdown[];
}

const MANAGED_SAVINGS_TYPES: ManagedSavingsInvestment["type"][] = [
  "hishtalmut",
  "gemel",
  "hashkaa",
  "savings",
  "other",
];

function isLinked(investment: ManagedSavingsInvestment): boolean {
  return investment.linkedPublicFund != null;
}

/**
 * Computes the Managed Savings summary layer from already-serialized active
 * holdings. Server/data-layer helper — does not query external APIs and does
 * not read the mock/fallback trackPerformance object for the weighted 5Y
 * return calculation.
 */
export function calculateManagedSavingsSummary(
  investments: ManagedSavingsInvestment[]
): ManagedSavingsSummary {
  const totalBalance = investments.reduce((sum, inv) => sum + inv.currentBalance, 0);
  const totalMonthlyContributions = investments.reduce(
    (sum, inv) => sum + inv.monthlyContribution,
    0
  );

  const linkedInvestments = investments.filter(isLinked);
  const linkedHoldingsCount = linkedInvestments.length;
  const unlinkedHoldingsCount = investments.length - linkedHoldingsCount;

  const linkedBalance = linkedInvestments.reduce((sum, inv) => sum + inv.currentBalance, 0);
  const linkedBalanceCoveragePercent =
    totalBalance > 0 ? (linkedBalance / totalBalance) * 100 : null;

  let weightedReturnNumerator = 0;
  let weightedReturnDenominator = 0;
  for (const inv of investments) {
    const fiveYrReturn = inv.linkedPublicFund?.latestAnnualized5YrReturn;
    if (isLinked(inv) && fiveYrReturn != null && inv.currentBalance > 0) {
      weightedReturnNumerator += fiveYrReturn * inv.currentBalance;
      weightedReturnDenominator += inv.currentBalance;
    }
  }
  const weightedLinkedAnnualized5YrReturn =
    weightedReturnDenominator > 0
      ? weightedReturnNumerator / weightedReturnDenominator
      : null;

  const holdingsByType: ManagedSavingsTypeBreakdown[] = MANAGED_SAVINGS_TYPES.map((type) => {
    const typeInvestments = investments.filter((inv) => inv.type === type);
    const typeBalance = typeInvestments.reduce((sum, inv) => sum + inv.currentBalance, 0);
    const typeContribution = typeInvestments.reduce(
      (sum, inv) => sum + inv.monthlyContribution,
      0
    );
    const typeLinked = typeInvestments.filter(isLinked).length;

    return {
      type,
      count: typeInvestments.length,
      totalBalance: typeBalance,
      totalMonthlyContribution: typeContribution,
      percentOfTotalBalance: totalBalance > 0 ? (typeBalance / totalBalance) * 100 : null,
      linkedCount: typeLinked,
      unlinkedCount: typeInvestments.length - typeLinked,
    };
  });

  return {
    totalBalance,
    totalMonthlyContributions,
    holdingsCount: investments.length,
    linkedHoldingsCount,
    unlinkedHoldingsCount,
    linkedBalance,
    linkedBalanceCoveragePercent,
    weightedLinkedAnnualized5YrReturn,
    holdingsByType,
  };
}

export interface ManagedSavingsProjectionTotals {
  currentBalance: number;
  monthlyContribution: number;
  in1Year: number;
  in5Years: number;
  in10Years: number;
  inCustomYears: number;
}

/**
 * Shared projection-totals aggregation — the single source of truth used by
 * both the per-group summary row and the global table totals row (Phase
 * 2D-2A). Reuses `projectWithAvailableReturnOrZero` per holding (same
 * function the main table's per-row cells use): a holding with a usable
 * linked public 5-year return compounds with that rate; a holding without
 * one uses an explicit 0% return assumption (current balance + accumulated
 * contributions). Never reads the mock/fallback trackPerformance value.
 */
export function calculateProjectionTotals(
  investments: ManagedSavingsInvestment[],
  customYears: number
): ManagedSavingsProjectionTotals {
  return investments.reduce<ManagedSavingsProjectionTotals>(
    (totals, investment) => {
      const projections = projectWithAvailableReturnOrZero(investment, customYears);
      return {
        currentBalance: totals.currentBalance + investment.currentBalance,
        monthlyContribution: totals.monthlyContribution + investment.monthlyContribution,
        in1Year: totals.in1Year + (projections[1]?.projectedValue ?? 0),
        in5Years: totals.in5Years + (projections[5]?.projectedValue ?? 0),
        in10Years: totals.in10Years + (projections[10]?.projectedValue ?? 0),
        inCustomYears:
          totals.inCustomYears + (projections[customYears]?.projectedValue ?? 0),
      };
    },
    {
      currentBalance: 0,
      monthlyContribution: 0,
      in1Year: 0,
      in5Years: 0,
      in10Years: 0,
      inCustomYears: 0,
    }
  );
}
