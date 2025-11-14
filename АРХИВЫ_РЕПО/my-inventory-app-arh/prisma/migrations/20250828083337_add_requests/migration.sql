-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('CANDIDATE', 'IN_REQUEST', 'EXTRA');

-- CreateTable
CREATE TABLE "public"."requests" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'CANDIDATE',
    "notes" TEXT,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request_items" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "deliveredQuantity" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "pricePerUnit" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "supplier" TEXT NOT NULL DEFAULT 'неизвестный поставщик',
    "customer" TEXT NOT NULL DEFAULT 'покупатель',

    CONSTRAINT "request_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."request_items" ADD CONSTRAINT "request_items_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."request_items" ADD CONSTRAINT "request_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
