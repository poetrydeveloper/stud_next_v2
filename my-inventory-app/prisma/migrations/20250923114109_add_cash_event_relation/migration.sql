/*
  Warnings:

  - You are about to drop the column `status` on the `product_units` table. All the data in the column will be lost.
  - Added the required column `statusCard` to the `product_units` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ProductUnitCardStatus" AS ENUM ('CANDIDATE', 'SPROUTED', 'IN_REQUEST', 'IN_DELIVERY');

-- CreateEnum
CREATE TYPE "public"."ProductUnitPhysicalStatus" AS ENUM ('IN_STORE', 'SOLD', 'CREDIT', 'LOST');

-- DropForeignKey
ALTER TABLE "public"."deliveries" DROP CONSTRAINT "deliveries_requestItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_units" DROP CONSTRAINT "product_units_deliveryId_fkey";

-- AlterTable
ALTER TABLE "public"."product_units" DROP COLUMN "status",
ADD COLUMN     "buyer_name" TEXT,
ADD COLUMN     "buyer_phone" TEXT,
ADD COLUMN     "credit_paid_at" TIMESTAMP(3),
ADD COLUMN     "in_requests" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isReturned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_credit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "logs" JSONB,
ADD COLUMN     "parentProductUnitId" INTEGER,
ADD COLUMN     "product_category_id" INTEGER,
ADD COLUMN     "product_category_name" TEXT,
ADD COLUMN     "product_code" TEXT,
ADD COLUMN     "product_description" TEXT,
ADD COLUMN     "product_name" TEXT,
ADD COLUMN     "product_tags" JSONB,
ADD COLUMN     "request_price_per_unit" DECIMAL(65,30),
ADD COLUMN     "returned_at" TIMESTAMP(3),
ADD COLUMN     "statusCard" "public"."ProductUnitCardStatus" NOT NULL,
ADD COLUMN     "statusProduct" "public"."ProductUnitPhysicalStatus",
ADD COLUMN     "store_stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "deliveryId" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."ProductUnitStatus";

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_requestItemId_fkey" FOREIGN KEY ("requestItemId") REFERENCES "public"."request_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_parentProductUnitId_fkey" FOREIGN KEY ("parentProductUnitId") REFERENCES "public"."product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
