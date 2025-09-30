/*
  Warnings:

  - You are about to drop the column `logs` on the `product_units` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product_units" DROP COLUMN "logs";

-- CreateTable
CREATE TABLE "public"."product_unit_logs" (
    "id" SERIAL NOT NULL,
    "productUnitId" INTEGER NOT NULL,
    "type" TEXT,
    "message" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_unit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."product_unit_logs" ADD CONSTRAINT "product_unit_logs_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES "public"."product_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;
