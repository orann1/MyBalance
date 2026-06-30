import {
  PublicDataSource,
  PublicDataSyncStatus,
  PublicDataSyncTrigger,
  type PublicDataResource,
} from "@prisma/client";
import { prisma } from "../db/prisma";
import { DataGovApiError, paginateDatastoreSearch } from "../public-data/data-gov-client";
import { normalizePublicFundRecord } from "./normalize-public-fund-record";
import type { RawPublicFundRecord } from "./types";

// Keep batching modest. 5,000 records per CKAN page is the suggested default.
const DEFAULT_PAGE_SIZE = 5_000;
const MAX_ERROR_SAMPLES = 5;

export interface SyncPublicFundsOptions {
  source?: PublicDataSource;
  /** Sync one specific resource by Data.gov.il resource ID. */
  resourceId?: string;
  /** Defaults to true — only `isCurrent` resources are synced unless overridden. */
  currentOnly?: boolean;
  pageSize?: number;
  triggeredBy?: PublicDataSyncTrigger;
}

export interface ResourceSyncResult {
  syncRunId: string;
  source: PublicDataSource;
  resourceId: string;
  resourceLabel: string;
  status: "success" | "failed";
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  errorMessage: string | null;
  durationMs: number;
}

/**
 * Resolves which `PublicDataResource` rows to sync. Reads resource config
 * from the DB rather than hardcoding resource IDs here.
 */
export async function selectResourcesToSync(
  options: SyncPublicFundsOptions,
): Promise<PublicDataResource[]> {
  if (options.resourceId) {
    const resource = await prisma.publicDataResource.findFirst({
      where: {
        resourceId: options.resourceId,
        isActive: true,
        ...(options.source ? { source: options.source } : {}),
      },
    });
    return resource ? [resource] : [];
  }

  return prisma.publicDataResource.findMany({
    where: {
      isActive: true,
      isCurrent: options.currentOnly ?? true,
      ...(options.source ? { source: options.source } : {}),
    },
    orderBy: [{ source: "asc" }, { label: "asc" }],
  });
}

/**
 * Syncs a single `PublicDataResource`: fetches, normalizes, and upserts its
 * records, and writes a `PublicDataSyncRun` history row.
 *
 * Count strategy: PublicFund spans many report periods, so counts are tracked
 * at FundReturn granularity (one source row = one FundReturn). A FundReturn
 * existence check runs before each upsert to classify insert vs. update.
 */
export async function syncPublicFundResource(
  resource: PublicDataResource,
  options: { pageSize?: number; triggeredBy?: PublicDataSyncTrigger } = {},
): Promise<ResourceSyncResult> {
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const triggeredBy = options.triggeredBy ?? PublicDataSyncTrigger.manual;
  const startedAt = Date.now();

  const syncRun = await prisma.publicDataSyncRun.create({
    data: {
      source: resource.source,
      resourceId: resource.resourceId,
      status: PublicDataSyncStatus.running,
      triggeredBy,
    },
  });

  let insertedCount = 0;
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const errorSamples: string[] = [];

  try {
    for await (const page of paginateDatastoreSearch<RawPublicFundRecord>(
      resource.resourceId,
      pageSize,
    )) {
      for (const raw of page) {
        const normalized = normalizePublicFundRecord(resource.source, raw, resource.resourceId);
        if (!normalized.ok) {
          skippedCount += 1;
          continue;
        }

        const { fund, fundReturn } = normalized.data;

        try {
          const upsertedFund = await prisma.publicFund.upsert({
            where: { source_fundId: { source: resource.source, fundId: fund.fundId } },
            update: {
              fundName: fund.fundName,
              managingCompany: fund.managingCompany,
              managingCompanyLegalId: fund.managingCompanyLegalId,
              controllingCorporation: fund.controllingCorporation,
              parentCompanyId: fund.parentCompanyId,
              parentCompanyName: fund.parentCompanyName,
              fundClassification: fund.fundClassification,
              specialization: fund.specialization,
              subSpecialization: fund.subSpecialization,
              targetPopulation: fund.targetPopulation,
              inceptionDate: fund.inceptionDate,
              lastSeenAt: new Date(),
            },
            create: fund,
          });

          const existingReturn = await prisma.fundReturn.findUnique({
            where: {
              publicFundId_reportPeriod: {
                publicFundId: upsertedFund.id,
                reportPeriod: fundReturn.reportPeriod,
              },
            },
            select: { id: true },
          });

          await prisma.fundReturn.upsert({
            where: {
              publicFundId_reportPeriod: {
                publicFundId: upsertedFund.id,
                reportPeriod: fundReturn.reportPeriod,
              },
            },
            update: fundReturn,
            create: { ...fundReturn, publicFundId: upsertedFund.id },
          });

          if (existingReturn) {
            updatedCount += 1;
          } else {
            insertedCount += 1;
          }
        } catch (rowError) {
          errorCount += 1;
          if (errorSamples.length < MAX_ERROR_SAMPLES) {
            const period = fundReturn.reportPeriod.toISOString().slice(0, 7);
            errorSamples.push(
              `fundId=${fund.fundId} reportPeriod=${period}: ${
                rowError instanceof Error ? rowError.message : "unknown row error"
              }`,
            );
          }
        }
      }
    }

    const finishedAt = new Date();
    await prisma.publicDataSyncRun.update({
      where: { id: syncRun.id },
      data: {
        status: PublicDataSyncStatus.success,
        finishedAt,
        insertedCount,
        updatedCount,
        skippedCount,
        errorCount,
        errorMessage: errorSamples.length > 0 ? errorSamples.join(" | ") : null,
      },
    });

    await prisma.publicDataResource.update({
      where: { id: resource.id },
      data: { lastSyncedAt: finishedAt },
    });

    return {
      syncRunId: syncRun.id,
      source: resource.source,
      resourceId: resource.resourceId,
      resourceLabel: resource.label,
      status: "success",
      insertedCount,
      updatedCount,
      skippedCount,
      errorCount,
      errorMessage: errorSamples.length > 0 ? errorSamples.join(" | ") : null,
      durationMs: Date.now() - startedAt,
    };
  } catch (fatalError) {
    const message =
      fatalError instanceof DataGovApiError
        ? fatalError.message
        : fatalError instanceof Error
          ? fatalError.message
          : "Unknown sync error";

    await prisma.publicDataSyncRun.update({
      where: { id: syncRun.id },
      data: {
        status: PublicDataSyncStatus.failed,
        finishedAt: new Date(),
        insertedCount,
        updatedCount,
        skippedCount,
        errorCount,
        errorMessage: message,
      },
    });

    return {
      syncRunId: syncRun.id,
      source: resource.source,
      resourceId: resource.resourceId,
      resourceLabel: resource.label,
      status: "failed",
      insertedCount,
      updatedCount,
      skippedCount,
      errorCount,
      errorMessage: message,
      durationMs: Date.now() - startedAt,
    };
  }
}

/**
 * Syncs every resource matched by `options`, sequentially (avoid aggressive
 * parallelism against a public, non-SLA API).
 */
export async function syncPublicFunds(
  options: SyncPublicFundsOptions = {},
): Promise<ResourceSyncResult[]> {
  const resources = await selectResourcesToSync(options);
  const results: ResourceSyncResult[] = [];

  for (const resource of resources) {
    const result = await syncPublicFundResource(resource, {
      pageSize: options.pageSize,
      triggeredBy: options.triggeredBy,
    });
    results.push(result);
  }

  return results;
}
