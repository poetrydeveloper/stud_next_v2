-- CreateTable
CREATE TABLE "inventory_snapshots" (
    "id" SERIAL NOT NULL,
    "snapshotDate" TIMESTAMP(3) NOT NULL,
    "productUnitId" INTEGER,
    "statusProduct" "ProductUnitPhysicalStatus",
    "salePrice" DOUBLE PRECISION,
    "stockValue" DOUBLE PRECISION,
    "periodType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sales_history" (
    "id" SERIAL NOT NULL,
    "productUnitId" INTEGER NOT NULL,
    "cashEventId" INTEGER NOT NULL,
    "periodDate" TIMESTAMP(3) NOT NULL,
    "periodType" TEXT NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_sales_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_forecasts" (
    "id" SERIAL NOT NULL,
    "productUnitId" INTEGER NOT NULL,
    "forecastDate" TIMESTAMP(3) NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "periodType" TEXT NOT NULL,
    "predictedSales" INTEGER NOT NULL,
    "recommendedOrder" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "actualSales" INTEGER,
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reorder_points" (
    "id" SERIAL NOT NULL,
    "productUnitId" INTEGER NOT NULL,
    "minStock" INTEGER NOT NULL,
    "maxStock" INTEGER NOT NULL,
    "reorderQty" INTEGER NOT NULL,
    "leadTime" INTEGER NOT NULL,
    "safetyStock" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reorder_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_snapshots_snapshotDate_productUnitId_periodType_key" ON "inventory_snapshots"("snapshotDate", "productUnitId", "periodType");

-- CreateIndex
CREATE UNIQUE INDEX "product_sales_history_productUnitId_cashEventId_key" ON "product_sales_history"("productUnitId", "cashEventId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_forecasts_productUnitId_periodStart_periodType_key" ON "inventory_forecasts"("productUnitId", "periodStart", "periodType");

-- CreateIndex
CREATE UNIQUE INDEX "reorder_points_productUnitId_key" ON "reorder_points"("productUnitId");

-- AddForeignKey
ALTER TABLE "inventory_snapshots" ADD CONSTRAINT "inventory_snapshots_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES "product_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales_history" ADD CONSTRAINT "product_sales_history_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES "product_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_sales_history" ADD CONSTRAINT "product_sales_history_cashEventId_fkey" FOREIGN KEY ("cashEventId") REFERENCES "cash_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_forecasts" ADD CONSTRAINT "inventory_forecasts_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES "product_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reorder_points" ADD CONSTRAINT "reorder_points_productUnitId_fkey" FOREIGN KEY ("productUnitId") REFERENCES "product_units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
