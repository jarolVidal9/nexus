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
import { ProfileComponent } from './features/profile/profile/profile.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { LayoutComponent } from './layout/layout/layout.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/landing/landingpage/landingpage.component').then(m => m.LandingpageComponent),
    },
    {
        path: 'auth/login',
        canActivate: [redirectIfAuthenticatedGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'auth/register',
        canActivate: [redirectIfAuthenticatedGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'reset-password/:token',
        canActivate:[redirectIfAuthenticatedGuard],
        loadComponent: () => import('./features/auth/resetpassword/resetpassword.component').then(m => m.ResetpasswordComponent),
    },
    {
        path: '',
        component: LayoutComponent,
        children:[
            {
                path: 'dashboard',
                canActivate: [authGuard], 
                loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
            },
            {
                path:'goals',
                canActivate: [authGuard],
                loadComponent: () => import('./features/goals/goals.component').then(m => m.GoalsComponent),
            },
            {
                path: 'finance',
                canActivate: [authGuard],
                loadComponent: () => import('./features/finance/finance.component').then(m => m.FinanceComponent),
            },
            {
                path: 'notes',
                canActivate: [authGuard],
                loadComponent: () => import('./features/notes/notes.component').then(m => m.NotesComponent),
            },
            {
                path: 'personal',
                canActivate: [authGuard],
                loadComponent: () => import('./features/personal/personal.component').then(m => m.PersonalComponent),},
            {
                path: 'private',
                canActivate: [authGuard],
                loadComponent: () => import('./features/private/private.component').then(m => m.PrivateComponent),
            },
            {
                path: 'profile',
                canActivate: [authGuard],
                loadComponent: () => import('./features/profile/profile/profile.component').then(m => m.ProfileComponent),
            },
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];
