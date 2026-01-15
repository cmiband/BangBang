import { Module } from '@nestjs/common';
import { ThreadsGateway } from './threads.gateway';
import { ChatsService } from '../chats/chats.service';

@Module({
  providers: [ThreadsGateway, ChatsService]
})
export class ThreadModule {}
