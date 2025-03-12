import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { AuthEntity } from './entity/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async login(login: string, password:string): Promise<AuthEntity>{

        const user = await this.userService.findUserByLogin(login);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new NotFoundException('Invalid password');
        }

        return {
            accessToken: this.jwtService.sign({ userId: user.id, login: user.login})
        };

    }

    async register(login: string, password: string): Promise<AuthEntity> {
        const user = await this.userService.createUser(login, password);

        return {
            accessToken: this.jwtService.sign({ userId: user.id, login: user.login })
        };
    }

    

}
