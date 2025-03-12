import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async createUser(login: string, password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                login,
                password: hashPassword,
            }
        });
    }

    async findUserByLogin(login: string) {
        console.log("User trying to log in:" + login);

        const user = await this.prisma.user.findUnique({
            where:{
                login: login
            }
        });

        return user;
    }

    async findUserById(id: number) {
        return this.prisma.user.findUnique({
            where:{
                id: id
            }
        });
    }

    async findDailyRateByUserIdAndDate(userId: number, date: Date){
        console.log(userId, date)

        const dailyRateStatus =  await this.prisma.dailySuccessRate.findFirst({
            where:{
                userId: userId,
                date: date
            }
        })

        if (dailyRateStatus){
            console.log("Daily record created for the date!")
            return dailyRateStatus;
        }else{
            // Create daily rate for a month ahead in a future

            console.log("Creating daily success rates for a year!")

            const numberOfDaysToFill = 365;

            for (let i = 0; i < numberOfDaysToFill; i++){
                const dateToFill = new Date(date);
                dateToFill.setDate(date.getDate() + i);

                await this.prisma.dailySuccessRate.create({
                    data:{
                        userId: userId,
                        date: dateToFill,
                        successFoodRate: 0,
                        successWaterRate: 0
                    }
                })
            }

        }
    }

    async changeCaloriesGoal(userId: number, caloriesGoal: number){
        return this.prisma.user.update({
            where:{
                id: userId
            },
            data:{
                caloriesGoal: caloriesGoal
            }
        })
    }

    async changeWaterGoal(userId: number, waterGoal: number){
        return this.prisma.user.update({
            where:{
                id: userId
            },
            data:{
                waterGoal: waterGoal
            }
        })
    }

}
