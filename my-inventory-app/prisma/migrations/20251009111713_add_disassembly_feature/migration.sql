-- CreateEnum
CREATE TYPE "public"."UnitDisassemblyStatus" AS ENUM ('MONOLITH', 'DISASSEMBLED', 'PARTIAL', 'COLLECTED', 'RESTORED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ProductUnitPhysicalStatus" ADD VALUE 'IN_DISASSEMBLED';
ALTER TYPE "public"."ProductUnitPhysicalStatus" ADD VALUE 'IN_COLLECTED';

-- AlterTable
ALTER TABLE "public"."product_units" ADD COLUMN     "disassembledParentId" INTEGER,
ADD COLUMN     "disassemblyStatus" "public"."UnitDisassemblyStatus" NOT NULL DEFAULT 'MONOLITH',
ADD COLUMN     "isParsingAlgorithm" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."disassembly_scenarios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentUnitId" INTEGER NOT NULL,
    "partsCount" INTEGER NOT NULL,
    "childProductsIds" JSONB NOT NULL,
    "partialChildUnits" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disassembly_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disassembly_scenarios_parentUnitId_key" ON "public"."disassembly_scenarios"("parentUnitId");

-- AddForeignKey
ALTER TABLE "public"."disassembly_scenarios" ADD CONSTRAINT "disassembly_scenarios_parentUnitId_fkey" FOREIGN KEY ("parentUnitId") REFERENCES "public"."product_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_disassembledParentId_fkey" FOREIGN KEY ("disassembledParentId") REFERENCES "public"."product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
