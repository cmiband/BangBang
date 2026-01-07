import { Injectable } from '@nestjs/common';
import { response, Response } from "express";
import { User, UserProfileReturn,AccountInfoResponseData, LOGIN_RESPONSE_SUCCESSFUL, LOGIN_RESPONSE_FAILED, REGISTER_RESPONSE_SUCCESSFUL, REGISTER_RESPONSE_FAILED, USER_FOUND, USER_NOT_FOUND, LoginResponseData, ForgotPasswordResponseData, RegisterResponseData } from "../types/types";

@Injectable()
export class LoginUserService {

  userCollection: Array<User> = [
    { id: crypto.randomUUID(), username: "barti", password: "sigma", email: "barti@test.com", name: "Barti", surname: "Bartowski", country: "Poland", dob: "19.03.2003"}
  ];

  validateLogin(username: string, password: string, res: Response): Response {
    const targetedUser = this.userCollection.find((user) => {
      return user.username == username && user.password == password;
    });

    let responseMessage: string;
    let loginSuccessful: boolean;
    let userId: string;
    if(!targetedUser) {
      responseMessage = LOGIN_RESPONSE_FAILED;
      loginSuccessful = false;
      userId = "";
    } else {
      responseMessage = LOGIN_RESPONSE_SUCCESSFUL;
      loginSuccessful = true;
      userId = targetedUser.id;
    }

    const responseData: LoginResponseData = {
      message: responseMessage,
      successful: loginSuccessful,
      userId: userId
    };
    return res.status(200).json(responseData);
  }

  registerUser(userData: User, res: Response): Response {
    const newUser = userData;

    if(this.checkIfUserWithEmailExist(newUser.email)) {
      const failedResult: RegisterResponseData = {
        message: REGISTER_RESPONSE_FAILED,
        successful: false
      };
      return res.status(200).json(failedResult);
    }

    this.userCollection.push(newUser);
    const successResult: RegisterResponseData = {
      message: REGISTER_RESPONSE_SUCCESSFUL,
      successful: true
    }
    return res.status(200).json(successResult);
  }

  getUserPassword(email: string, res: Response): Response {
    if(!this.checkIfUserWithEmailExist(email)) {
      const failedResult: ForgotPasswordResponseData = {
        message: USER_NOT_FOUND,
        successful: false,
        username: "",
        password: ""
      };

      return res.status(200).json(failedResult);
    }

    const targetedUser: User | undefined = this.userCollection.find((user) => user.email == email);
    if(targetedUser == undefined) {
      return res.status(404);
    }
    const successResult: ForgotPasswordResponseData = {
      message: USER_FOUND,
      successful: true,
      username: targetedUser.username,
      password: targetedUser.password
    };
    return res.status(200).json(successResult);
  }

  checkIfUserWithEmailExist(email: string): boolean {
    return this.userCollection.find((user) => user.email === email) != undefined;
  }

getUserByUsernamePasword(username: string, password: string): AccountInfoResponseData {
    const targetedUser = this.userCollection.find((user) => {
      return user.username == username && user.password == password;
    });

    let responseMessage: string;
    let findSuccessful: boolean;
    let userToSend: UserProfileReturn | null;
    if(!targetedUser) {
      responseMessage = LOGIN_RESPONSE_FAILED;
      findSuccessful = false
      userToSend = null
    } else {
      responseMessage = LOGIN_RESPONSE_SUCCESSFUL;
      findSuccessful = true;
      userToSend = {
        name: targetedUser.name,
        surname: targetedUser.surname,
        email: targetedUser.email,
        dob: targetedUser.dob,
        country: targetedUser.country
      };
    }

    const responseData: AccountInfoResponseData = {
      message: responseMessage,
      successful: findSuccessful,
      user: userToSend
    };
    return responseData;
  }
}
