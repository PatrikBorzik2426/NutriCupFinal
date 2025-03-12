import { IsString } from "class-validator";

export class FindFoodDto {
    @IsString()
    name: string;
}