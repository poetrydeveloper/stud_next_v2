/*
  Warnings:

  - You are about to drop the column `status` on the `requests` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ItemStatus" AS ENUM ('CANDIDATE', 'IN_REQUEST', 'EXTRA');

-- DropForeignKey
ALTER TABLE "public"."request_items" DROP CONSTRAINT "request_items_requestId_fkey";

-- AlterTable
ALTER TABLE "public"."request_items" ADD COLUMN     "status" "public"."ItemStatus" NOT NULL DEFAULT 'CANDIDATE',
ALTER COLUMN "requestId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."requests" DROP COLUMN "status";

-- DropEnum
DROP TYPE "public"."RequestStatus";

-- AddForeignKey
ALTER TABLE "public"."request_items" ADD CONSTRAINT "request_items_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
