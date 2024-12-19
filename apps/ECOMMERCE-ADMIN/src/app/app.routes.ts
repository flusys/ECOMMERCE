import { Routes } from '@angular/router';

export const routes: Routes = [
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
