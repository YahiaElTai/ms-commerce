/*
  Warnings:

  - A unique constraint covering the columns `[lineItemId]` on the table `Price` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lineItemId]` on the table `Variant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productName` to the `LineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LineItem" ADD COLUMN     "productKey" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "lineItemId" INTEGER,
ALTER COLUMN "variantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "lineItemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Price_lineItemId_key" ON "Price"("lineItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_lineItemId_key" ON "Variant"("lineItemId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_lineItemId_fkey" FOREIGN KEY ("lineItemId") REFERENCES "LineItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
