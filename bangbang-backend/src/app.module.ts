import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginUserController } from './login-user/login-user.controller';
import { LoginUserService } from "./login-user/login-user.service";
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';

@Module({
  imports: [],
  controllers: [AppController, LoginUserController, MatchController],
  providers: [AppService, LoginUserService, MatchService],
})
export class AppModule {}
