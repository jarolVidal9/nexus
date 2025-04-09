import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LandingpageComponent } from './features/landing/landingpage/landingpage.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';    

export const routes: Routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'auth/register',
        component: RegisterComponent
    },
    {
        path: 'dashboard',
        component:DashboardComponent
    },
    {
        path: '**',
        component:LandingpageComponent
    },
];
