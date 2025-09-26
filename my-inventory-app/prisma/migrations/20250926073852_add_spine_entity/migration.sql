-- AlterTable
ALTER TABLE "public"."product_units" ADD COLUMN     "spineId" INTEGER;

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "spineId" INTEGER;

-- CreateTable
CREATE TABLE "public"."spines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "imagePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spines_slug_key" ON "public"."spines"("slug");

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES "public"."spines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_units" ADD CONSTRAINT "product_units_spineId_fkey" FOREIGN KEY ("spineId") REFERENCES "public"."spines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."spines" ADD CONSTRAINT "spines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
