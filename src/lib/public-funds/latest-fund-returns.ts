import { prisma } from "@/lib/db/prisma";

export interface LatestFundReturnSummary {
  reportPeriod: Date;
  // monthlyReturn and ytdReturn are always present in FundReturn rows.
  monthlyReturn: number;
  ytdReturn: number;
  // Annualized multi-year returns are optional in the schema.
  annualized3YrReturn: number | null;
  annualized5YrReturn: number | null;
}

/**
 * Batch lookup of the latest FundReturn metrics for a set of PublicFund ids.
 * Used to enrich linked-fund summaries without N+1 queries.
 *
 * Returns public fund-level return metrics only — never AUM, never personal
 * financial data, never presented as the user's personal return.
 */
export async function getLatestFundReturnSummaries(
  publicFundIds: string[]
): Promise<Map<string, LatestFundReturnSummary>> {
  if (publicFundIds.length === 0) return new Map();

  const returns = await prisma.fundReturn.findMany({
    where: { publicFundId: { in: publicFundIds } },
    orderBy: { reportPeriod: "desc" },
    select: {
      publicFundId: true,
      reportPeriod: true,
      monthlyReturn: true,
      ytdReturn: true,
      annualized3YrReturn: true,
      annualized5YrReturn: true,
    },
  });

  const map = new Map<string, LatestFundReturnSummary>();
  for (const row of returns) {
    if (!map.has(row.publicFundId)) {
      map.set(row.publicFundId, {
        reportPeriod: row.reportPeriod,
        monthlyReturn: Number(row.monthlyReturn),
        ytdReturn: Number(row.ytdReturn),
        annualized3YrReturn:
          row.annualized3YrReturn !== null ? Number(row.annualized3YrReturn) : null,
        annualized5YrReturn:
          row.annualized5YrReturn !== null ? Number(row.annualized5YrReturn) : null,
      });
    }
  }
  return map;
}
