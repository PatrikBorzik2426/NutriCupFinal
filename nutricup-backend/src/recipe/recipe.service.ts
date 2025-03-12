import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Ingredient } from './dto/ingredient.dto';

@Injectable()
export class RecipeService {

  constructor(private prisma: PrismaService) {}

  getDate(date: Date) {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    date = new Date(year, month, day) 

    return date
  }

  async createRecipe(userName: string, name: string, ingredientsIds: number[]) {
    const recipe = await this.prisma.recipe.create({
      data: {
        name: name,
        creator: userName,
      }
    })

    ingredientsIds.forEach(async(ingredientId)=>{
      console.log(ingredientId)
      await this.prisma.recipeFoodData.create({
        data:{
          recipeId: recipe.id,
          foodId: ingredientId,
          amount: 1
        }
      })
    })
  }


  async searchRecipe(name: string) {
    return await this.prisma.$queryRaw`
        SELECT *, similarity(name, ${name}) AS similarity_score
        FROM "Recipe"
        ORDER BY similarity_score DESC
        LIMIT 30;
    `;
  }

  async getRecipeIngredients(recipeId: number) {
    console.log(recipeId)


    return this.prisma.recipeFoodData.findMany({
      where: {
        recipeId: recipeId
      },
      include:{
        FoodData: true
      }
    })
  }

  async recipeIntoDailyFoodRecord(userId: number, ingredients: any[], date: Date) {
    
    date = this.getDate(date)

    ingredients.forEach(async(ingredient)=>{ 
      await this.prisma.dailyFoodRecord.create({
        data:{
          userId: userId,
          foodId: ingredient.foodId,
          amount: ingredient.amount,
          date: date,
          recipeId: ingredient.recipeId
        }
      })
    })
  }

  async createNewIngredient(ingredient: Ingredient){
    console.log(ingredient)

    return this.prisma.foodData.create({
      data: {
        name: ingredient.name,
        calories: ingredient.calories,
        category: "general",
        fat: ingredient.fat,
        protein: ingredient.protein,
        fiber: ingredient.fiber,
        sugar: ingredient.sugar,
        cholesterol: ingredient.cholesterol,
        sodium: ingredient.sodium,
        calcium: ingredient.calcium,
        iron: ingredient.iron,
        magnesium: ingredient.magnesium
      }
    })
  }
}
