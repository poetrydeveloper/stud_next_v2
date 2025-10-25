-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
