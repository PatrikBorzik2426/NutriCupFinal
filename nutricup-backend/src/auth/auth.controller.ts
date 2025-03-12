import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth-guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() {login, password}: LoginDto) {

    if (!login || !password || login === '' || password === '') {
      return {
        message: 'Please provide login and password'
      }
    }

    return this.authService.login(login, password);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthEntity })
  register(@Body() {login, password}: LoginDto) {
    return this.authService.register(login, password);
  }

  // Simple JWT token validation endpoint
  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validate(@Request() req ) {
    const user = req.user;
    // Today date
    let date = new Date()

    const day = date.getDate()-1
    const month = date.getMonth()
    const year = date.getFullYear()

    date = new Date(year, month, day) 

    this.userService.findDailyRateByUserIdAndDate(user.id, date)
    
    return req.user;
  }

}
