/*
  Warnings:

  - You are about to drop the column `adminId` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "ArticleStatus" ADD VALUE 'PROCESSING';

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_adminId_fkey";

-- DropIndex
DROP INDEX "articles_adminId_idx";

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "adminId";

-- DropTable
DROP TABLE "admins";
