import type { Food } from "./Food";

export interface FoodRecord{
    id: number,
    foodData: Food,
    amount: number,
    date: Date,
    recipeId: number
}