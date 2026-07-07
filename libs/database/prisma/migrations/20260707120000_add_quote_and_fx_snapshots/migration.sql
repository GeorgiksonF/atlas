-- CreateTable
CREATE TABLE "quote_snapshots" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyType" NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "quote_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fx_snapshots" (
    "id" TEXT NOT NULL,
    "usdToRub" DECIMAL(12,6) NOT NULL,
    "snapshotDate" DATE NOT NULL,

    CONSTRAINT "fx_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quote_snapshots_assetId_snapshotDate_key" ON "quote_snapshots"("assetId", "snapshotDate");

-- CreateIndex
CREATE UNIQUE INDEX "fx_snapshots_snapshotDate_key" ON "fx_snapshots"("snapshotDate");

-- AddForeignKey
ALTER TABLE "quote_snapshots" ADD CONSTRAINT "quote_snapshots_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
