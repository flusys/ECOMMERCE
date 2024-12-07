import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/auth/component/auth-layout/auth-layout.component').then(
        (com) => com.AuthLayoutComponent
      ),
    loadChildren: () => [
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/component/login/login.component').then(
            (com) => com.LoginComponent
          ),
      },
      {
        path: 'registration',
        loadComponent: () =>
          import('./core/auth/component/register/register.component').then(
            (com) => com.RegisterComponent
          ),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./core/auth/component/forgot-password/forgot-password.component').then(
            (com) => com.ForgotPasswordComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/components/app-layout/app-layout.component').then(
        (com) => com.AppLayoutComponent
      ),
    loadChildren: () => [
      
    ],
  },
  {
    path: 'error', loadComponent: () => import('flusysng/pages')
      .then(com => com.ErrorComponent),
  },
  {
    path: 'access', loadComponent: () => import('flusysng/pages')
      .then(com => com.AccessComponent),
  },
  {
    path: 'notfound', loadComponent: () => import('flusysng/pages')
      .then(com => com.NotfoundComponent),
  },
  {
    path: '**',
    redirectTo: '/notfound',
    pathMatch: 'full',
  },
];
