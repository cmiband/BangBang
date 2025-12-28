import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { HomePage } from './pages/home-page/home-page';
import { SignUpPage } from './pages/sign-up-page/sign-up-page';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
    {
        path: "",
        pathMatch: 'full',
        redirectTo: "login"
    },
    {
        path: "login",
        component: LoginPage
    },
    {
        path: "forgotPassword",
        component: ForgotPasswordPage
    },
    {
        path: "signUp",
        component: SignUpPage
    },
    {
        path: "profile",
        component: ProfilePage,
        canActivate: [authGuard]
    },
    {
        path: "home",
        component: HomePage,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
