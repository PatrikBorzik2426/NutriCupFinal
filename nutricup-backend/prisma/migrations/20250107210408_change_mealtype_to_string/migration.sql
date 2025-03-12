/*
  Warnings:

  - The `mealType` column on the `DailyFoodRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DailyFoodRecord" DROP COLUMN "mealType",
ADD COLUMN     "mealType" TEXT;

-- DropEnum
DROP TYPE "MealType";
