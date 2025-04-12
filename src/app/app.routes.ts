import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LandingpageComponent } from './features/landing/landingpage/landingpage.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';    
import { authGuard } from './core/guards/auth.guard';
import { SubjectsComponent } from './features/subjects/subjects.component';

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
        canActivate: [authGuard], 
        component:DashboardComponent
    },
    {
        path:'subject',
        component: SubjectsComponent
    },
    {
        path: '**',
        component:LandingpageComponent
    },
];
