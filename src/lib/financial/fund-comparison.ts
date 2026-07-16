import { projectCompoundingWithFee } from "@/lib/financial/projection";

/**
 * Pure comparison layer on top of the Phase 2F-1 projection engine. Used by
 * the Fund Replacement Simulator (Phase 2F-2) to compare a current-fund
 * assumption set against a candidate-fund assumption set at a given horizon.
 * No React/i18n/Prisma knowledge, no persistence — the caller decides which
 * real return/fee values to plug into each scenario.
 */
export interface FundProjectionScenario {
  currentBalance: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  annualFeePercent: number;
  years: number;
}

export interface FundProjectionComparison {
  years: number;
  currentProjectedValue: number;
  candidateProjectedValue: number;
  difference: number;
}

/**
 * Compares two projection scenarios (current vs. candidate) at the same
 * horizon, reusing projectCompoundingWithFee for both — no formula
 * duplication. Difference is candidate minus current.
 */
export function compareFundProjections({
  currentScenario,
  candidateScenario,
}: {
  currentScenario: FundProjectionScenario;
  candidateScenario: FundProjectionScenario;
}): FundProjectionComparison {
  const current = projectCompoundingWithFee(currentScenario);
  const candidate = projectCompoundingWithFee(candidateScenario);

  return {
    years: currentScenario.years,
    currentProjectedValue: current.projectedValue,
    candidateProjectedValue: candidate.projectedValue,
    difference: candidate.projectedValue - current.projectedValue,
  };
}

const BASELINE_HORIZONS = [1, 5, 10];

/**
 * Builds the sorted, de-duplicated list of horizons the simulator result
 * table should show: 1/5/10 years plus the selected custom horizon (omitted
 * if it duplicates a baseline value).
 */
export function buildSimulatorHorizons(customYears: number): number[] {
  const years = new Set(BASELINE_HORIZONS);
  if (customYears) {
    years.add(customYears);
  }
  return Array.from(years).sort((a, b) => a - b);
}
