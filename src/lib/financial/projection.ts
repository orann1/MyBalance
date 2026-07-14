/**
 * Pure, scalar-input projection engine. No React, i18n, Prisma, UI types, or
 * domain (ManagedSavingsInvestment) knowledge — callers map their own domain
 * shape to these scalar inputs. Reused by Managed Savings today; intended to
 * also back the future Fund Replacement Simulator (Phase 2F-2+) against two
 * parameter sets without duplicating the formula.
 */

export interface ScalarProjectionInput {
  currentBalance: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  annualFeePercent: number;
  years: number;
}

export interface ScalarProjectionResult {
  years: number;
  projectedValue: number;
  estimatedContributions: number;
  estimatedFees: number;
  estimatedNetGain: number;
}

/**
 * Fee-adjusted monthly-compounding projection. Preserves the original
 * Managed Savings formula exactly, including its zero-effective-rate guard:
 * when the annual return exactly offsets the annual fee (adjustedGrowthRate
 * === 0), the annuity term's division by monthlyRate is undefined — the
 * mathematical limit as the rate approaches zero is a flat linear sum of
 * contributions, so that value is used instead of dividing by zero.
 */
export function projectCompoundingWithFee(
  input: ScalarProjectionInput
): ScalarProjectionResult {
  const { currentBalance, monthlyContribution, annualReturnPercent, annualFeePercent, years } =
    input;

  const monthsOfContribution = years * 12;
  const totalContributions = currentBalance + monthlyContribution * monthsOfContribution;

  const baseGrowthRate = annualReturnPercent / 100;
  const adjustedGrowthRate = baseGrowthRate - annualFeePercent / 100;
  const monthlyRate = adjustedGrowthRate / 12;

  const projectedValue =
    monthlyRate === 0
      ? Math.round(totalContributions)
      : Math.round(
          currentBalance * Math.pow(1 + monthlyRate, monthsOfContribution) +
            (monthlyContribution * (Math.pow(1 + monthlyRate, monthsOfContribution) - 1)) /
              monthlyRate
        );

  const estimatedFees = Math.round(
    totalContributions * (annualFeePercent / 100) * years || 0
  );
  const estimatedNetGain = projectedValue - totalContributions;

  return {
    years,
    projectedValue,
    estimatedContributions: totalContributions,
    estimatedFees,
    estimatedNetGain,
  };
}

/**
 * Zero-return fallback projection: current balance plus linearly accumulated
 * monthly contributions, with no growth and no fee drag. Used when there is
 * no usable return assumption for a holding (approved product behavior —
 * never a mock/invented rate). Guarantees a zero-contribution input projects
 * to exactly `currentBalance` at every horizon, and never divides by zero.
 */
export function projectLinearWithoutFee(
  input: Pick<ScalarProjectionInput, "currentBalance" | "monthlyContribution" | "years">
): ScalarProjectionResult {
  const { currentBalance, monthlyContribution, years } = input;

  const monthsOfContribution = years * 12;
  const totalContributions = currentBalance + monthlyContribution * monthsOfContribution;

  return {
    years,
    projectedValue: totalContributions,
    estimatedContributions: totalContributions,
    estimatedFees: 0,
    estimatedNetGain: 0,
  };
}
