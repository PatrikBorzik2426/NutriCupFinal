/*
  Warnings:

  - You are about to drop the column `recipeName` on the `DailyFoodRecord` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DailyFoodRecord" DROP COLUMN "recipeName",
ADD COLUMN     "recipeId" INTEGER DEFAULT -1;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_name_key" ON "Recipe"("name");
