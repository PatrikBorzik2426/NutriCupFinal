import type { RecipeDetail } from "./RecipeDetail";

export interface RecipeSearch
{
    id: number,
    name: string,
    creator: string,
    arrow: any,
    recipeDetail: RecipeDetail[]
}