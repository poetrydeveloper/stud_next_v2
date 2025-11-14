/*
  Warnings:

  - You are about to drop the column `childProductsIds` on the `disassembly_scenarios` table. All the data in the column will be lost.
  - You are about to drop the column `parentUnitId` on the `disassembly_scenarios` table. All the data in the column will be lost.
  - You are about to drop the column `partialChildUnits` on the `disassembly_scenarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentProductCode,name]` on the table `disassembly_scenarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `childProductCodes` to the `disassembly_scenarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentProductCode` to the `disassembly_scenarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."disassembly_scenarios" DROP CONSTRAINT "disassembly_scenarios_parentUnitId_fkey";

-- DropIndex
DROP INDEX "public"."disassembly_scenarios_parentUnitId_key";

-- AlterTable
ALTER TABLE "public"."disassembly_scenarios" DROP COLUMN "childProductsIds",
DROP COLUMN "parentUnitId",
DROP COLUMN "partialChildUnits",
ADD COLUMN     "childProductCodes" JSONB NOT NULL,
ADD COLUMN     "parentProductCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."product_units" ADD COLUMN     "disassemblyScenarioId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "disassembly_scenarios_parentProductCode_name_key" ON "public"."disassembly_scenarios"("parentProductCode", "name");

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_disassemblyScenarioId_fkey" FOREIGN KEY ("disassemblyScenarioId") REFERENCES "public"."disassembly_scenarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
