/*
  Warnings:

  - Made the column `brandId` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."products" DROP CONSTRAINT "products_brandId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "brandId" SET NOT NULL;

-- CreateTable
CREATE TABLE "stock_traffic_lights" (
    "id" SERIAL NOT NULL,
    "productCode" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "minStock" INTEGER NOT NULL DEFAULT 1,
    "normalStock" INTEGER NOT NULL DEFAULT 2,
    "goodStock" INTEGER NOT NULL DEFAULT 3,
    "weeklySales" INTEGER NOT NULL DEFAULT 0,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_traffic_lights_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stock_traffic_lights_productCode_key" ON "stock_traffic_lights"("productCode");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_traffic_lights" ADD CONSTRAINT "stock_traffic_lights_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
