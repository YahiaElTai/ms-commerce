/*
  Warnings:

  - Added the required column `currency` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "currency" "Currency" NOT NULL,
ALTER COLUMN "customerEmail" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LineItem" ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DEFAULT 1;
