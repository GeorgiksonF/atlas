-- CreateEnum
CREATE TYPE "PortfolioCategory" AS ENUM ('INVESTMENTS', 'CRYPTO');

-- AlterTable
ALTER TABLE "portfolios" ADD COLUMN     "category" "PortfolioCategory" NOT NULL DEFAULT 'INVESTMENTS';
