/*
  Warnings:

  - Made the column `quantity` on table `LineItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LineItem" ALTER COLUMN "quantity" SET NOT NULL;
