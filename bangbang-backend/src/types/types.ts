export type User = {
    id: string,
  username: string;
  password: string;
  email: string
  name : string
  surname: string
  country: string
  dob: string
};

export type LoginResponseData = {
    message: string,
    successful: boolean,
    userId: string
}

export type RegisterResponseData = {
    message: string,
    successful: boolean
}

export type ForgotPasswordResponseData = {
    message: string,
    successful: boolean,
    username: string,
    password: string
}

export const LOGIN_RESPONSE_SUCCESSFUL = 'LOGIN_SUCCESSFUL';
export const LOGIN_RESPONSE_FAILED = 'LOGIN_FAILED';
export const REGISTER_RESPONSE_SUCCESSFUL = 'REGISTER_SUCCESSFUL';
export const REGISTER_RESPONSE_FAILED = 'REGISTER_FAILED';
export const USER_NOT_FOUND = "USER_NOT_FOUND";
export const USER_FOUND = "USER_FOUND";