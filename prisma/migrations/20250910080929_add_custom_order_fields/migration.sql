/*
  Warnings:

  - The values [DECORATION] on the enum `IngredientType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."IngredientType_new" AS ENUM ('BISCUIT', 'SOAKING', 'CREAM', 'FILLING', 'DECOR');
ALTER TABLE "public"."Ingredient" ALTER COLUMN "type" TYPE "public"."IngredientType_new" USING ("type"::text::"public"."IngredientType_new");
ALTER TYPE "public"."IngredientType" RENAME TO "IngredientType_old";
ALTER TYPE "public"."IngredientType_new" RENAME TO "IngredientType";
DROP TYPE "public"."IngredientType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."CustomCakeOrder" ADD COLUMN     "minimumWeight" DOUBLE PRECISION,
ADD COLUMN     "rushOrder" BOOLEAN;
