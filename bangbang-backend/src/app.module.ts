import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginUserController } from './login-user/login-user.controller';
import { LoginUserService } from "./login-user/login-user.service";

@Module({
  imports: [],
  controllers: [AppController, LoginUserController],
  providers: [AppService, LoginUserService],
})
export class AppModule {}
