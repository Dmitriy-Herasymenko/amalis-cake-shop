-- CreateEnum
CREATE TYPE "public"."IngredientType" AS ENUM ('BISCUIT', 'CREAM', 'DECORATION', 'FILLING');

-- CreateTable
CREATE TABLE "public"."CustomCakeOrder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "eventType" TEXT,
    "weight" DOUBLE PRECISION,
    "comment" TEXT,
    "customImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomCakeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."IngredientType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomCakeIngredient" (
    "id" SERIAL NOT NULL,
    "customCakeOrderId" INTEGER NOT NULL,
    "ingredientId" INTEGER NOT NULL,

    CONSTRAINT "CustomCakeIngredient_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CustomCakeIngredient" ADD CONSTRAINT "CustomCakeIngredient_customCakeOrderId_fkey" FOREIGN KEY ("customCakeOrderId") REFERENCES "public"."CustomCakeOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomCakeIngredient" ADD CONSTRAINT "CustomCakeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "public"."Ingredient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
