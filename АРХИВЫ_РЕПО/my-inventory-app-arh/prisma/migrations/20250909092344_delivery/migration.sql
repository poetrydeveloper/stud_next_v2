-- CreateEnum
CREATE TYPE "public"."DeliveryStatus" AS ENUM ('PARTIAL', 'OVER', 'FULL', 'EXTRA');

-- CreateTable
CREATE TABLE "public"."deliveries" (
    "id" SERIAL NOT NULL,
    "requestItemId" INTEGER NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL,
    "status" "public"."DeliveryStatus" NOT NULL DEFAULT 'PARTIAL',
    "extra_shipment" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "supplierName" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "extraRequest" BOOLEAN NOT NULL DEFAULT false,
    "pricePerUnit" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_requestItemId_fkey" FOREIGN KEY ("requestItemId") REFERENCES "public"."request_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."deliveries" ADD CONSTRAINT "deliveries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
