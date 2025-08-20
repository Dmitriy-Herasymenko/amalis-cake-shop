/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."DeliveryType" AS ENUM ('PICKUP', 'DELIVERY');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "deliveryType" "public"."DeliveryType",
ADD COLUMN     "orderNumber" INTEGER,
ADD COLUMN     "storeId" INTEGER,
ALTER COLUMN "address" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."OrderStatus" DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "public"."Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
