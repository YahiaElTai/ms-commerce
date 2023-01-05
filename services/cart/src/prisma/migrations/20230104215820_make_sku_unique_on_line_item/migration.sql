/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `LineItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LineItem_sku_key" ON "LineItem"("sku");
