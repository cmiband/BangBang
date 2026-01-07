import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from "express";
import { LoginUserService } from './login-user.service';
import { User } from "../types/types";

@Controller('/users')
export class LoginUserController {
    constructor(private readonly loginUserService: LoginUserService) {}

    @Get('/test')
    test() {
        return "test";
    }

    @Get('/getUser')
    async getUser(@Query('username') username: string, @Query('password') password: string) {
        return this.loginUserService.getUserByUsernamePasword(username,password)
    }   

    @Post("/login")
    login(@Body() body: { username: string, password: string }, @Res() res: Response) {
        return this.loginUserService.validateLogin(body.username, body.password, res);
    }

    @Post("/register")
    register(@Body() body: User, @Res() res: Response) {
        return this.loginUserService.registerUser(body, res);
    }

    @Post("/forgotpassword")
    resetPassword(@Body() body: { email: string }, @Res() res: Response) {
        return this.loginUserService.getUserPassword(body.email, res);
    }
}
