/*
  Warnings:

  - A unique constraint covering the columns `[node_index]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[node_index]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[node_index]` on the table `spines` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "human_path" TEXT,
ADD COLUMN     "node_index" TEXT,
ADD COLUMN     "parent_id" INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "human_path" TEXT,
ADD COLUMN     "node_index" TEXT;

-- AlterTable
ALTER TABLE "spines" ADD COLUMN     "human_path" TEXT,
ADD COLUMN     "node_index" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categories_node_index_key" ON "categories"("node_index");

-- CreateIndex
CREATE INDEX "categories_node_index_idx" ON "categories"("node_index");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_node_index_key" ON "products"("node_index");

-- CreateIndex
CREATE INDEX "products_node_index_idx" ON "products"("node_index");

-- CreateIndex
CREATE UNIQUE INDEX "spines_node_index_key" ON "spines"("node_index");

-- CreateIndex
CREATE INDEX "spines_node_index_idx" ON "spines"("node_index");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
