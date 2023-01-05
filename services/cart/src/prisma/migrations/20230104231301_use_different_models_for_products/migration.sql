/*
  Warnings:

  - You are about to drop the column `lineItemId` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Variant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_lineItemId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropIndex
DROP INDEX "Price_lineItemId_key";

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "lineItemId";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "PriceForProduct" (
    "id" SERIAL NOT NULL,
    "centAmount" INTEGER NOT NULL,
    "currencyCode" "Currency" NOT NULL DEFAULT 'EUR',
    "fractionDigits" INTEGER NOT NULL DEFAULT 2,
    "variantId" INTEGER,

    CONSTRAINT "PriceForProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantForProduct" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "VariantForProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceForProduct_variantId_key" ON "PriceForProduct"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "VariantForProduct_sku_key" ON "VariantForProduct"("sku");

-- AddForeignKey
ALTER TABLE "PriceForProduct" ADD CONSTRAINT "PriceForProduct_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "VariantForProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantForProduct" ADD CONSTRAINT "VariantForProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
