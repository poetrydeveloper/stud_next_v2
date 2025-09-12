-- CreateEnum
CREATE TYPE "public"."ProductUnitStatus" AS ENUM ('IN_STORE', 'SOLD', 'LOST');

-- CreateTable
CREATE TABLE "public"."product_units" (
    "id" SERIAL NOT NULL,
    "serial_number" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "deliveryId" INTEGER NOT NULL,
    "status" "public"."ProductUnitStatus" NOT NULL DEFAULT 'IN_STORE',
    "sale_price" DOUBLE PRECISION,
    "sold_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_units_serial_number_key" ON "public"."product_units"("serial_number");

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "public"."deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
