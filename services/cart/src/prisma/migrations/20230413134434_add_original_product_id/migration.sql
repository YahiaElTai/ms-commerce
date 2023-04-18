/*
  Warnings:

  - Added the required column `originalId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "originalId" INTEGER NOT NULL;
