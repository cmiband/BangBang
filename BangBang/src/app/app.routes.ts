import { Routes } from '@angular/router';
import { App } from "./app";
import { LoginPage } from './pages/login-page/login-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { ProfilePage } from './pages/profile-page/profile-page';
import { SignUpPage } from './pages/sign-up-page/sign-up-page';
import { authGuard } from './auth/auth-guard';
import { UserListTest } from './pages/user-list-test/user-list-test'
import { ChangeInfoPage } from "./pages/change-info-page/change-info-page"
import { GalleryPage } from "./pages/gallery-page/gallery-page"

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
        path: "testUsers",
        component: UserListTest,
    },
    {
        path: "changeInfo",
        component: ChangeInfoPage,
        canActivate: [authGuard]
    },
    {
        path: "gallery",
        component: GalleryPage,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
