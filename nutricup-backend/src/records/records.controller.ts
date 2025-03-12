import { Controller, Post, UseGuards, Request, Body, Patch, Put } from '@nestjs/common';
import { RecordsService } from './records.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import type { FindFoodDto } from './dto/find-food.dto';
import { UserService } from 'src/user/user.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService, private userService: UserService) {}

  @Post('listfood')
  @UseGuards(JwtAuthGuard)
  listFood( @Body() FindFoodDto: FindFoodDto) {

    const { name } = FindFoodDto;

    return this.recordsService.findFoodRecordByName(name)
  }

  @Post('addwater')
  @UseGuards(JwtAuthGuard)
  addWater(@Request() req, @Body() { amount, date }) {
    date = new Date(date)
    return this.recordsService.createWaterRecord(req.user.id, amount, date)
  }

  @Post('waterAmountDaily')
  @UseGuards(JwtAuthGuard)
  waterAmountDaily(@Request() req, @Body() { date }) {
    date = new Date(date)
    return this.recordsService.countAllWaterRecordsForTheDay(req.user.id, date)
  }

  @Post('addfood')
  @UseGuards(JwtAuthGuard)
  createFoodRecord(@Request() req, @Body() {foodId, amount, date }) {
    date = new Date(date)
    return this.recordsService.createDailyFoodRecord(req.user.id, foodId, amount, date)
  }

  @Post('deletefoodrecord')
  @UseGuards(JwtAuthGuard)
  deleteFoodRecord(@Request() req, @Body() { id, date }) {
    date = new Date(date)

    return this.recordsService.deleteDailyFoodRecord(req.user.id, id, date)
  }

  @Post('getdailyfoodrecords')
  @UseGuards(JwtAuthGuard)
  getDailyFoodRecords(@Request() req, @Body() { date }) {
    date = new Date(date)
    return this.recordsService.getDailyFoodRecords(req.user.id, date)
  }

  @Post('getdailywaterrecords')
  @UseGuards(JwtAuthGuard)
  getDailyWaterRecords(@Request() req, @Body() { date }) {
    date = new Date(date)
    return this.recordsService.getDailyWaterRecords(req.user.id, date)
  }

  @Post('getnutritionsum')
  @UseGuards(JwtAuthGuard)
  getNutritionSum(@Request() req, @Body() { date }) {
    date = new Date(date)
    return this.recordsService.getNutritionSum(req.user.id, date)
  }

  @Post('changeCaloriesGoal')
  @UseGuards(JwtAuthGuard)
  changeCaloriesGoal(@Request() req, @Body() { newGoal }) {
    return this.userService.changeCaloriesGoal(req.user.id, newGoal)
  }

  @Post('changeWaterGoal')
  @UseGuards(JwtAuthGuard)
  changeWaterGoal(@Request() req, @Body() { newGoal }) {
    return this.userService.changeWaterGoal(req.user.id, newGoal)
  }

  @Put('updateFoodRecord')
  @UseGuards(JwtAuthGuard)
  updateFoodRecord(@Request() req, @Body() { id, amount, date }) {

    date = new Date(date)

    return this.recordsService.modifyFoodRecord(req.user.id, id, date, amount)
  }

  @Put('updateWaterRecord')
  @UseGuards(JwtAuthGuard)
  updateWaterRecord(@Request() req, @Body() { id, amount, date }) {

    date = new Date(date)

    return this.recordsService.updateWaterRecord(req.user.id, id, amount, date)
  }

}
