/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Cake` table. All the data in the column will be lost.
  - Added the required column `image` to the `Cake` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Cake` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Cake" DROP COLUMN "updatedAt",
ADD COLUMN     "image" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
