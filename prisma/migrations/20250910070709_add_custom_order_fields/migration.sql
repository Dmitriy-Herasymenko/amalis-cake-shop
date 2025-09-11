/*
  Warnings:

  - The `status` column on the `CustomCakeOrder` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deliveryType` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[orderNumber]` on the table `CustomCakeOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."CustomCakeOrder" ADD COLUMN     "orderNumber" INTEGER NOT NULL DEFAULT floor(((random() * (900000)::double precision) + (100000)::double precision)),
ADD COLUMN     "persons" INTEGER,
ADD COLUMN     "tiers" INTEGER,
ADD COLUMN     "totalPrice" DOUBLE PRECISION,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "deliveryType",
ADD COLUMN     "deliveryType" "public"."DeliveryType",
DROP COLUMN "status",
ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'NEW';

-- CreateIndex
CREATE UNIQUE INDEX "CustomCakeOrder_orderNumber_key" ON "public"."CustomCakeOrder"("orderNumber");
