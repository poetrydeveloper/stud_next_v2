-- CreateEnum
CREATE TYPE "public"."CashEventType" AS ENUM ('SALE', 'RETURN', 'PRICE_QUERY', 'ORDER');

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "brandId" INTEGER;

-- CreateTable
CREATE TABLE "public"."brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cash_days" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cash_events" (
    "id" SERIAL NOT NULL,
    "type" "public"."CashEventType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "cash_day_id" INTEGER NOT NULL,
    "product_unit_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "public"."brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "public"."brands"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "cash_days_date_key" ON "public"."cash_days"("date");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_events" ADD CONSTRAINT "cash_events_cash_day_id_fkey" FOREIGN KEY ("cash_day_id") REFERENCES "public"."cash_days"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cash_events" ADD CONSTRAINT "cash_events_product_unit_id_fkey" FOREIGN KEY ("product_unit_id") REFERENCES "public"."product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
