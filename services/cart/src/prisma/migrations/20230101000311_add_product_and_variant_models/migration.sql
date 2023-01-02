/*
  Warnings:

  - You are about to drop the column `sku` on the `LineItem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'USD', 'GBP');

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "customerEmail" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "LineItem" DROP COLUMN "sku";

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "centAmount" INTEGER NOT NULL,
    "currencyCode" "Currency" NOT NULL DEFAULT 'EUR',
    "fractionDigits" INTEGER NOT NULL DEFAULT 2,
    "variantId" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "productKey" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Price_variantId_key" ON "Price"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_sku_key" ON "Variant"("sku");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
