import { Body, Controller, Get, Post, Query, Res, Put } from '@nestjs/common';
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
    @Get('/getAllUsers')
    async getAllUsers() {
        return this.loginUserService.getAllUsers()
    }  
    @Get('/emailCheck')
    async emailCheck(@Query('email') email: string) {
        return this.loginUserService.checkIfUserWithEmailExist(email)
    }

    @Put("/updateUser")
    updateUser(@Body() body: {oldEmail:string,oldPassword:string, name: string, surname: string, country: string, city: string, password: string, email: string },@Res() res: Response) {
        return this.loginUserService.updateUser(body.oldEmail,body.oldPassword,body.name, body.surname,body.country,body.city,body.password,body.email, res)
    }

    @Put("/updateUserAvatar")
    updateUserAvatar(@Body() body: {email:string, password:string,username:string,url:string},@Res() res: Response) {
        return this.loginUserService.updateUserAvatar(body.email,body.password,body.username,body.url,res);
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
