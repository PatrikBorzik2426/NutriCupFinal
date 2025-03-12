-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeFoodData" (
    "recipeId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RecipeFoodData_pkey" PRIMARY KEY ("recipeId","foodId")
);

-- CreateTable
CREATE TABLE "_FoodDataToRecipe" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FoodDataToRecipe_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FoodDataToRecipe_B_index" ON "_FoodDataToRecipe"("B");

-- AddForeignKey
ALTER TABLE "RecipeFoodData" ADD CONSTRAINT "RecipeFoodData_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeFoodData" ADD CONSTRAINT "RecipeFoodData_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "FoodData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodDataToRecipe" ADD CONSTRAINT "_FoodDataToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "FoodData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodDataToRecipe" ADD CONSTRAINT "_FoodDataToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
