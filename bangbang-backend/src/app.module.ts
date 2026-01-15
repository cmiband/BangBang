import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginUserController } from './login-user/login-user.controller';
import { LoginUserService } from "./login-user/login-user.service";
import { MatchController } from './match/match.controller';
import { MatchService } from './match/match.service';
import { ChatsController } from './chats/chats.controller';
import { ChatsService } from './chats/chats.service';
import { ThreadsGateway } from './threads/threads.gateway';
import { ThreadModule } from './threads/threads.module';

@Module({
  imports: [ThreadModule],
  controllers: [AppController, LoginUserController, MatchController, ChatsController],
  providers: [AppService, LoginUserService, MatchService, ChatsService, ThreadsGateway],
})
export class AppModule {}
