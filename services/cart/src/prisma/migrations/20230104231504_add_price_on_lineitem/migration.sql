/*
  Warnings:

  - A unique constraint covering the columns `[lineItemId]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "lineItemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Price_lineItemId_key" ON "Price"("lineItemId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
