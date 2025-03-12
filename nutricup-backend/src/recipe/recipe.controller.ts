import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { recipeDto } from './dto/recipe.dto';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() recipeDto: recipeDto) {
    return this.recipeService.createRecipe(req.user.login, recipeDto.name, recipeDto.ingredients);
  }

  @Post('search')
  @UseGuards(JwtAuthGuard)
  search(@Body() {name}) {
    return this.recipeService.searchRecipe(name);
  }

  @Post('getingredients')
  @UseGuards(JwtAuthGuard)
  getIngredients(@Body() {recipeId}) {
    return this.recipeService.getRecipeIngredients(recipeId);
  }
  
  @Post('createdailyrecords')
  @UseGuards(JwtAuthGuard)
  createDailyRecords(@Request() req, @Body() {ingredients, date}) {
    
    date = new Date(date);

    return this.recipeService.recipeIntoDailyFoodRecord(req.user.id, ingredients,date);
  }

  @Post('addIngredient')
  @UseGuards(JwtAuthGuard)
  addIngredient(@Body() {ingredient}) {
    return this.recipeService.createNewIngredient(ingredient);
  }
}
