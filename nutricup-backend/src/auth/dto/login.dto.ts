import {ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class LoginDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    login: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}