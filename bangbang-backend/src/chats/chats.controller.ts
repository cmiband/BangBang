import { Get, Controller, Query, Res } from '@nestjs/common';
import { Response } from "express";
import { LoginUserService } from "../login-user/login-user.service";
import { MatchService } from "../match/match.service";
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {

    constructor(private readonly chatsService: ChatsService, private readonly loginUserService: LoginUserService, private readonly matchService: MatchService) {}

    @Get('/available') 
    getAvailableChats(@Query("currentid") currentId: string, @Res() res : Response) {
        const allUsers = this.loginUserService.userCollection;

        return this.chatsService.getThreadsToChat(currentId, allUsers, res);
    }
}
