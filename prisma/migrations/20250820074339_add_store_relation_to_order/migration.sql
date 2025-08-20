/*
  Warnings:

  - You are about to drop the column `comment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `totalPrice` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `deliveryType` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `orderNumber` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "comment",
DROP COLUMN "paid",
ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER,
DROP COLUMN "deliveryType",
ADD COLUMN     "deliveryType" TEXT,
DROP COLUMN "orderNumber",
ADD COLUMN     "orderNumber" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NEW';
