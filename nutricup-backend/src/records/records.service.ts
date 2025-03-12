import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecordsService {

  getDate(date: Date) {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    date = new Date(year, month, day) 

    return date
  }

  getDailyWaterRecords(userId: number, date: Date) {
    date = this.getDate(date)

    return this.prisma.waterRecord.findMany({
      where: {
        userId: userId,
        date: date
      }
    })

  }

  constructor(private prisma:PrismaService){}  

  async createWaterRecord(userId: number, amount: number, date: Date) {

    date = this.getDate(date)

    console.log("Trying to create water record for user: " + userId + " with amount: " + amount + " and date: " + date)

    const waterRecord = await this.prisma.waterRecord.create({
      data: {
        userId: userId,
        date: date,
        amount: amount,
      }
    })

    await this.updateCaloriesSuccess(userId, date);
    
    return waterRecord;
  }

  async countAllWaterRecordsForTheDay(userId: number, date: Date) {

    date = this.getDate(date) 

    return this.prisma.waterRecord.aggregate({
      _sum:{
        amount: true
      },
      where:{
        userId: userId,
        date: date
      }
    })
  }

  async createDailyFoodRecord(userId: number, foodId: number, amount: number, date: Date) {
    
    date = this.getDate(date) 

    console.log("Trying to create food record for user: " + userId + " with foodId: " + foodId + " and amount: " + amount + " and date: " + date)
    
    const newRecord = await this.prisma.dailyFoodRecord.create({
      data: {
        userId: userId,
        date: date,
        foodId: foodId,
        amount: amount,
      }
    })

    await this.updateCaloriesSuccess(userId, date)

    const foodData = await this.prisma.foodData.findUnique({
      where: {
        id: newRecord.foodId
      }
    })

    return{
      id: newRecord.id,
      foodData: foodData,
      amount: newRecord.amount,
      date: newRecord.date,
      recipeId: newRecord.recipeId
    }
  }

  // Search for a similar food record based on name
  async findFoodRecordByName(name: string) {
    return await this.prisma.$queryRaw`
        SELECT *, similarity(name, ${name}) AS similarity_score
        FROM "FoodData"
        ORDER BY similarity_score DESC
        LIMIT 30;
    `;
  }

  async getDailyFoodRecords(userId: number, date: Date) {

    date = this.getDate(date)

    const dailyFoodRecords = await this.prisma.dailyFoodRecord.findMany({
      where: {
        userId: userId,
        date: date
      }
    })

    // For each record find corresponding food data and nutrition data

    const records = []
    for (const record of dailyFoodRecords) {
      const foodData = await this.prisma.foodData.findUnique({
        where: {
          id: record.foodId
        }
      })

      records.push({
        id: record.id,
        foodData: foodData,
        amount: record.amount,
        date: record.date,
        recipeId: record.recipeId
      })
    }

    console.log("Records of food for the date: ", date, " are: ", records)

    return records

  }

  async getNutritionSum(userId: number, date: Date) {

    date = this.getDate(date) 

    const dailyFoodRecords = await this.prisma.dailyFoodRecord.findMany({
      where: {
        userId: userId,
        date: date
      }
    })

    const nutritionSum = {
      fiber: 0,
      protein: 0,
      fat: 0,
      sugar: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      sodium: 0,
      calories: 0
    }

    for (const record of dailyFoodRecords) {
      const foodData = await this.prisma.foodData.findUnique({
        where: {
          id: record.foodId
        }
      })

      console.log(foodData.name, foodData.protein, foodData.fat, foodData.sugar, record.amount)

      nutritionSum.fiber += foodData.fiber * record.amount
      nutritionSum.protein += foodData.protein/100 * record.amount
      nutritionSum.fat += foodData.fat/100 * record.amount
      nutritionSum.sugar += foodData.sugar/100 * record.amount
      nutritionSum.calcium += foodData.calcium * record.amount
      nutritionSum.iron += foodData.iron * record.amount
      nutritionSum.magnesium += foodData.magnesium * record.amount
      nutritionSum.sodium += foodData.sodium * record.amount
      nutritionSum.calories += foodData.calories * record.amount
    }

    return nutritionSum
  }

  async updateWaterRecord(userId: number, recordId: number, amount: number, date: Date) {

    console.log()
    
    date = this.getDate(date) 

    const record = await this.prisma.waterRecord.findFirst({
      where:{
        id: recordId,
        date: date,
        userId: userId
      }
    })

    if(amount === 0){
      await this.prisma.waterRecord.delete({
        where: {
          id: record.id,
          date: record.date,
          userId: record.userId
        }
      })
    }else{
      await this.prisma.waterRecord.update({
        data: {
          amount: amount
        },
        where: {
          id: record.id,
          date: record.date,
          userId: record.userId
        }
      })
    }

    this.updateCaloriesSuccess(userId, date)
  }

  async updateCaloriesSuccess(userId: number, date: Date) {
    date = this.getDate(date)
    
    const caloriesGoal = await this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select:{
        caloriesGoal: true,
        waterGoal: true
      }
    })

    // Get all user records for the day
    const dailyRecords = await this.prisma.dailyFoodRecord.findMany({
      where: {
        userId: userId,
        date: date
      }
    })

    // Calculate total calories for the day success rate
    let totalCalories = 0;
    for (const record of dailyRecords) {
      totalCalories += record.amount;
    }

    // Create daily success rate record
    const caloriesRate = totalCalories/caloriesGoal.caloriesGoal*100;
    const waterRate  = (await this.countAllWaterRecordsForTheDay(userId, date))._sum.amount/caloriesGoal.waterGoal*100;

    const currentRate = await this.prisma.dailySuccessRate.findFirst({
      where: {
        userId: userId,
        date: date
      }
    })

    console.log(currentRate)

    // Update rate
    await this.prisma.dailySuccessRate.update({
      data:{
        successFoodRate: caloriesRate,
        successWaterRate: waterRate
      },
      where: {
        userId: userId,
        date: date,
        id: currentRate.id
      }
    })
  }

  async deleteDailyFoodRecord(userId: number, recordId: number, date: Date) {
    
    date = this.getDate(date)

    console.log("Deleting food record with id: ", recordId, " for user: ", userId, " and date: ", date)

    await this.prisma.dailyFoodRecord.delete({
      where: {
        id: recordId,
        date: date,
        userId: userId
      }
    })

    await this.updateCaloriesSuccess(userId, date)

  }

  async modifyFoodRecord(userId: number, recordId: number, date: Date, amount: number) {
    console.log("date:", date)

    date = this.getDate(date)

    await this.prisma.dailyFoodRecord.update({
      data:{
        amount: amount
      },
      where:{
        id: recordId,
        userId: userId,
        date: date
      }
    })

    await this.updateCaloriesSuccess(userId, date)

  }
}
