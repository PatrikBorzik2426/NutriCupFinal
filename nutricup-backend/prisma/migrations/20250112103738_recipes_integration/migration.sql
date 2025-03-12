/*
  Warnings:

  - You are about to drop the column `mealType` on the `DailyFoodRecord` table. All the data in the column will be lost.
  - Added the required column `creator` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyFoodRecord" DROP COLUMN "mealType",
ADD COLUMN     "recipeName" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "creator" TEXT NOT NULL;
