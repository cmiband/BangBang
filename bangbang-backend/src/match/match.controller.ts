import { Controller,Get,Query,Res,Body,Post } from '@nestjs/common';
import { Response } from "express";
import { MatchService } from './match.service';
import { LoginUserService } from '../login-user/login-user.service';

@Controller('match')
export class MatchController {

    constructor(private readonly loginUserService: LoginUserService, private readonly matchService: MatchService) {}

    @Get("/available")
    getAvailableMatches(@Query("currentid") currentUserId: string, @Res() response: Response) {
        const allUsers = this.loginUserService.userCollection;

        return this.matchService.getAvailableMatches(allUsers,currentUserId,response);
    }

    @Post("/creatematch")
    createMatch(@Body() body: {currentUserId: string, secondUserId: string, resolved: boolean}, @Res() response: Response) {
        return this.matchService.createMatch(body.currentUserId, body.secondUserId, body.resolved, response);
    }
}
