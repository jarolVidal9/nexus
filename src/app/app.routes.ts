import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LandingpageComponent } from './features/landing/landingpage/landingpage.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';    
import { authGuard } from './core/guards/auth.guard';
import { GoalsComponent } from './features/goals/goals.component';
import { FinanceComponent } from './features/finance/finance.component';
import { NotesComponent } from './features/notes/notes.component';
import { PersonalComponent } from './features/personal/personal.component';
import { PrivateComponent } from './features/private/private.component';
import { redirectIfAuthenticatedGuard } from './core/guards/redirect-if-authenticated.guard';
import { ResetpasswordComponent } from './features/auth/resetpassword/resetpassword.component';

export const routes: Routes = [
    {
        path: 'auth/login',
        canActivate: [redirectIfAuthenticatedGuard],
        component: LoginComponent
    },
    {
        path: 'auth/register',
        canActivate: [redirectIfAuthenticatedGuard],
        component: RegisterComponent
    },
    {
        path: 'reset-password/:token',
        canActivate:[redirectIfAuthenticatedGuard],
        component: ResetpasswordComponent
    },
    {
        path: 'dashboard',
        canActivate: [authGuard], 
        component:DashboardComponent
    },
    {
        path:'goals',
        canActivate: [authGuard],
        component: GoalsComponent
    },
    {
        path: 'finance',
        canActivate: [authGuard],
        component: FinanceComponent
    },
    {
        path: 'notes',
        canActivate: [authGuard],
        component: NotesComponent
    },
    {
        path: 'personal',
        canActivate: [authGuard],
        component: PersonalComponent
    },
    {
        path: 'private',
        canActivate: [authGuard],
        component: PrivateComponent
    },
    {
        path: '**',
        component:LandingpageComponent
    },
];
