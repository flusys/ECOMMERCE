import { Route } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'product-list',
        loadComponent: () =>
          import('./pages/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'product-details/:id',
        loadComponent: () =>
          import('./pages/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/contact-us/contact-us.component').then(
            (m) => m.ContactUsComponent
          ),
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./pages/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
