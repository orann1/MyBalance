-- AlterTable
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN     "publicFundId" TEXT;

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_publicFundId_idx" ON "ManagedSavingsHolding"("publicFundId");

-- AddForeignKey
ALTER TABLE "ManagedSavingsHolding" ADD CONSTRAINT "ManagedSavingsHolding_publicFundId_fkey" FOREIGN KEY ("publicFundId") REFERENCES "PublicFund"("id") ON DELETE SET NULL ON UPDATE CASCADE;
