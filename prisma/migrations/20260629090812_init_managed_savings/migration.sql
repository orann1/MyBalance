-- CreateEnum
CREATE TYPE "ManagedSavingsType" AS ENUM ('hishtalmut', 'gemel', 'hashkaa', 'savings');

-- CreateEnum
CREATE TYPE "OwnerLabel" AS ENUM ('self', 'spouse', 'child', 'shared', 'family', 'other');

-- CreateEnum
CREATE TYPE "HoldingStatus" AS ENUM ('active', 'inactive', 'archived');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagedSavingsHolding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ManagedSavingsType" NOT NULL,
    "owner" "OwnerLabel" NOT NULL DEFAULT 'self',
    "status" "HoldingStatus" NOT NULL DEFAULT 'active',
    "currentBalanceMinor" BIGINT NOT NULL DEFAULT 0,
    "monthlyContributionMinor" BIGINT NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'ILS',
    "accumulationFeeBps" INTEGER NOT NULL DEFAULT 0,
    "depositFeeBps" INTEGER NOT NULL DEFAULT 0,
    "managingCompany" TEXT,
    "trackName" TEXT,
    "officialFundId" TEXT,
    "valuationDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedSavingsHolding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_userId_idx" ON "ManagedSavingsHolding"("userId");

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_userId_status_idx" ON "ManagedSavingsHolding"("userId", "status");

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_type_idx" ON "ManagedSavingsHolding"("type");

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_officialFundId_idx" ON "ManagedSavingsHolding"("officialFundId");

-- AddForeignKey
ALTER TABLE "ManagedSavingsHolding" ADD CONSTRAINT "ManagedSavingsHolding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
