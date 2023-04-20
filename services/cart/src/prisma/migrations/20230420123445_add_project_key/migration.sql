/*
  Warnings:

  - Added the required column `projectKey` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectKey` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "projectKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "projectKey" TEXT NOT NULL;
