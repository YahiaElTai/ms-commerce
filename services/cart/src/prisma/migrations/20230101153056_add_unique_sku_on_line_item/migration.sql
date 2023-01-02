/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `LineItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sku` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "sku" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LineItem_sku_key" ON "LineItem"("sku");
