-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('RUB');

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "currency" "CurrencyType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotes_assetId_key" ON "quotes"("assetId");

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
