import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./core/auth/component/auth-layout/auth-layout.component')
      .then(com => com.AuthLayoutComponent),
    loadChildren: () => [
      {
        path: 'login',
        loadComponent: () => import('./core/auth/component/login/login.component')
          .then(com => com.LoginComponent),
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
