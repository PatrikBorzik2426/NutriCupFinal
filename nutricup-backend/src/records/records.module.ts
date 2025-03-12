import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [RecordsController],
  providers: [RecordsService, UserService],
})
export class RecordsModule {}
