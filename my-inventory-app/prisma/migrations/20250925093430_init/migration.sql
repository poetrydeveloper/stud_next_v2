/*
  Warnings:

  - You are about to drop the column `created_at` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `buyer_name` on the `product_units` table. All the data in the column will be lost.
  - You are about to drop the column `buyer_phone` on the `product_units` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryId` on the `product_units` table. All the data in the column will be lost.
  - You are about to drop the column `in_requests` on the `product_units` table. All the data in the column will be lost.
  - You are about to drop the column `store_stock` on the `product_units` table. All the data in the column will be lost.
  - You are about to alter the column `request_price_per_unit` on the `product_units` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `contact_person` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the `deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `request_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requests` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."deliveries" DROP CONSTRAINT "deliveries_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."deliveries" DROP CONSTRAINT "deliveries_requestItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_units" DROP CONSTRAINT "product_units_deliveryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_items" DROP CONSTRAINT "request_items_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_items" DROP CONSTRAINT "request_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_items" DROP CONSTRAINT "request_items_requestId_fkey";

-- DropForeignKey
ALTER TABLE "public"."request_items" DROP CONSTRAINT "request_items_supplierId_fkey";

-- AlterTable
ALTER TABLE "public"."customers" DROP COLUMN "created_at",
DROP COLUMN "email",
DROP COLUMN "updated_at",
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."product_units" DROP COLUMN "buyer_name",
DROP COLUMN "buyer_phone",
DROP COLUMN "deliveryId",
DROP COLUMN "in_requests",
DROP COLUMN "store_stock",
ADD COLUMN     "created_at_candidate" TIMESTAMP(3),
ADD COLUMN     "created_at_request" TIMESTAMP(3),
ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "quantity_in_candidate" INTEGER DEFAULT 0,
ADD COLUMN     "quantity_in_request" INTEGER DEFAULT 0,
ADD COLUMN     "supplierId" INTEGER,
ALTER COLUMN "request_price_per_unit" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."suppliers" DROP COLUMN "contact_person",
DROP COLUMN "created_at",
DROP COLUMN "notes",
DROP COLUMN "phone",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "public"."deliveries";

-- DropTable
DROP TABLE "public"."request_items";

-- DropTable
DROP TABLE "public"."requests";

-- DropEnum
DROP TYPE "public"."DeliveryStatus";

-- DropEnum
DROP TYPE "public"."ItemStatus";

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "public"."suppliers"("name");

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
