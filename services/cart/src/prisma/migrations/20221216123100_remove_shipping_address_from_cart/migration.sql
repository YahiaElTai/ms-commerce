/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the `ShippingAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_shippingAddressId_fkey";

-- DropForeignKey
ALTER TABLE "LineItem" DROP CONSTRAINT "LineItem_cartId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "shippingAddressId";

-- DropTable
DROP TABLE "ShippingAddress";

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
