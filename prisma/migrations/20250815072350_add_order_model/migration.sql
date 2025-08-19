-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('NEW', 'PROCESSING', 'DELIVERING', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "callBack" BOOLEAN NOT NULL DEFAULT false,
    "payment" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'NEW',
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "comment" TEXT,
    "items" JSONB NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
