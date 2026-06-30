-- CreateEnum
CREATE TYPE "PublicDataSource" AS ENUM ('gemelnet', 'pensionnet');

-- CreateEnum
CREATE TYPE "PublicDataSyncStatus" AS ENUM ('running', 'success', 'failed');

-- CreateEnum
CREATE TYPE "PublicDataSyncTrigger" AS ENUM ('manual', 'scheduled');

-- CreateEnum
CREATE TYPE "PublicFundProductType" AS ENUM ('hishtalmut', 'gemel', 'hashkaa', 'pension', 'unknown');

-- CreateTable
CREATE TABLE "PublicFund" (
    "id" TEXT NOT NULL,
    "source" "PublicDataSource" NOT NULL,
    "fundId" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "managingCompany" TEXT NOT NULL,
    "managingCompanyLegalId" TEXT,
    "controllingCorporation" TEXT,
    "parentCompanyId" TEXT,
    "parentCompanyName" TEXT,
    "productType" "PublicFundProductType",
    "fundClassification" TEXT,
    "specialization" TEXT,
    "subSpecialization" TEXT,
    "targetPopulation" TEXT,
    "inceptionDate" TIMESTAMP(3),
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicFund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundReturn" (
    "id" TEXT NOT NULL,
    "publicFundId" TEXT NOT NULL,
    "reportPeriod" TIMESTAMP(3) NOT NULL,
    "monthlyReturn" DECIMAL(10,4) NOT NULL,
    "ytdReturn" DECIMAL(10,4) NOT NULL,
    "trailing3YrReturn" DECIMAL(10,4),
    "trailing5YrReturn" DECIMAL(10,4),
    "annualized3YrReturn" DECIMAL(10,4),
    "annualized5YrReturn" DECIMAL(10,4),
    "assetsUnderManagement" DECIMAL(18,2),
    "assetsUnderManagementRaw" TEXT,
    "avgAnnualManagementFee" DECIMAL(10,4),
    "avgDepositFee" DECIMAL(10,4),
    "sourceResourceId" TEXT NOT NULL,
    "sourceSnapshotDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FundReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicDataResource" (
    "id" TEXT NOT NULL,
    "source" "PublicDataSource" NOT NULL,
    "label" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicDataResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicDataSyncRun" (
    "id" TEXT NOT NULL,
    "source" "PublicDataSource" NOT NULL,
    "resourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "PublicDataSyncStatus" NOT NULL DEFAULT 'running',
    "insertedCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "triggeredBy" "PublicDataSyncTrigger" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicDataSyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicFund_source_idx" ON "PublicFund"("source");

-- CreateIndex
CREATE INDEX "PublicFund_fundId_idx" ON "PublicFund"("fundId");

-- CreateIndex
CREATE INDEX "PublicFund_fundName_idx" ON "PublicFund"("fundName");

-- CreateIndex
CREATE INDEX "PublicFund_managingCompany_idx" ON "PublicFund"("managingCompany");

-- CreateIndex
CREATE UNIQUE INDEX "PublicFund_source_fundId_key" ON "PublicFund"("source", "fundId");

-- CreateIndex
CREATE INDEX "FundReturn_publicFundId_idx" ON "FundReturn"("publicFundId");

-- CreateIndex
CREATE INDEX "FundReturn_reportPeriod_idx" ON "FundReturn"("reportPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "FundReturn_publicFundId_reportPeriod_key" ON "FundReturn"("publicFundId", "reportPeriod");

-- CreateIndex
CREATE UNIQUE INDEX "PublicDataResource_source_resourceId_key" ON "PublicDataResource"("source", "resourceId");

-- CreateIndex
CREATE INDEX "PublicDataSyncRun_source_idx" ON "PublicDataSyncRun"("source");

-- CreateIndex
CREATE INDEX "PublicDataSyncRun_status_idx" ON "PublicDataSyncRun"("status");

-- CreateIndex
CREATE INDEX "PublicDataSyncRun_startedAt_idx" ON "PublicDataSyncRun"("startedAt");

-- AddForeignKey
ALTER TABLE "FundReturn" ADD CONSTRAINT "FundReturn_publicFundId_fkey" FOREIGN KEY ("publicFundId") REFERENCES "PublicFund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
