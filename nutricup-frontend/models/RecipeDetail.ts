import type { Food } from "./Food";

export interface RecipeDetail{
    foodId: number,
    recipeId: number,
    amount: number,
    FoodData: Food
}