-- AlterEnum
ALTER TYPE "CurrencyType" ADD VALUE 'USD';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'DEPOSIT';
ALTER TYPE "TransactionType" ADD VALUE 'WITHDRAWAL';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "currency" "CurrencyType" NOT NULL DEFAULT 'RUB',
ALTER COLUMN "assetId" DROP NOT NULL;
