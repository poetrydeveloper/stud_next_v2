-- AlterTable
ALTER TABLE "public"."product_images" ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "localPath" TEXT,
ADD COLUMN     "storageType" TEXT NOT NULL DEFAULT 'local';
