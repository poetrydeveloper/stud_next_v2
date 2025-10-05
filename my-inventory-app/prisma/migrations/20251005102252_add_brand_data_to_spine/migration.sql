/*
  Warnings:

  - You are about to drop the column `parentId` on the `categories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[path]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `path` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."ProductUnitCardStatus" ADD VALUE 'ARRIVED';

-- DropForeignKey
ALTER TABLE "public"."categories" DROP CONSTRAINT "categories_parentId_fkey";

-- AlterTable
ALTER TABLE "public"."categories" DROP COLUMN "parentId",
ADD COLUMN     "path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."spines" ADD COLUMN     "brandData" JSON;

-- CreateIndex
CREATE UNIQUE INDEX "categories_path_key" ON "public"."categories"("path");

-- CreateIndex
CREATE INDEX "categories_path_idx" ON "public"."categories"("path");
