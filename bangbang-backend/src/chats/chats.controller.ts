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
        const allMatches = this.matchService.matches;

        console.log('matches');
        console.log(allMatches);
        return this.chatsService.getThreadsToChat(currentId, allUsers, allMatches, res);
    }
}
