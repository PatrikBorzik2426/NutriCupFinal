/*
  Warnings:

  - You are about to drop the `GymExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GymRoutine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GymRoutine" DROP CONSTRAINT "GymRoutine_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "GymRoutine" DROP CONSTRAINT "GymRoutine_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "caloriesGoal" DOUBLE PRECISION NOT NULL DEFAULT 2000,
ADD COLUMN     "waterGoal" DOUBLE PRECISION NOT NULL DEFAULT 2;

-- DropTable
DROP TABLE "GymExercise";

-- DropTable
DROP TABLE "GymRoutine";

-- CreateTable
CREATE TABLE "DailySuccessRate" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "successFoodRate" DOUBLE PRECISION NOT NULL,
    "successWaterRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailySuccessRate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DailySuccessRate" ADD CONSTRAINT "DailySuccessRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
