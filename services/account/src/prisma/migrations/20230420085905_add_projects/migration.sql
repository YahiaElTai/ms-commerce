-- AlterTable
ALTER TABLE "User" ADD COLUMN     "projects" TEXT[] DEFAULT ARRAY[]::TEXT[];
