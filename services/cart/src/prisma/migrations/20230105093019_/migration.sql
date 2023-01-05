/*
  Warnings:

  - You are about to drop the column `sku` on the `LineItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LineItem_sku_key";

-- AlterTable
ALTER TABLE "LineItem" DROP COLUMN "sku";
