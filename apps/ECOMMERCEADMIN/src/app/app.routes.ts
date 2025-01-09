import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
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
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (com) => com.DashboardComponent
          ),
      },
      {
        path: 'company',
        loadComponent: () =>
          import('./pages/company/company.component').then(
            (com) => com.CompanyComponent
          ),
      },
      {
        path: 'brand',
        loadComponent: () =>
          import('./pages/brand/brand.component').then(
            (com) => com.BrandComponent
          ),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./pages/category/category.component').then(
            (com) => com.CategoryComponent
          ),
      },
      {
        path: 'attribute',
        loadComponent: () =>
          import('./pages/attribute/attribute.component').then(
            (com) => com.AttributeComponent
          ),
      },
      {
        path: 'tag',
        loadComponent: () =>
          import('./pages/tag/tag.component').then((com) => com.TagComponent),
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('./pages/gallery/gallery.component').then((com) => com.GalleryComponent),
      },
      {
        path: 'create-product',
        loadComponent: () =>
          import('./pages/create-product/create-product.component').then(
            (com) => com.CreateProductComponent
          ),
      },
      {
        path: 'product-list',
        loadComponent: () =>
          import('./pages/product-list/product-list.component').then(
            (com) => com.ProductListComponent
          ),
      },
    ],
  },
  {
    path: 'error',
    loadComponent: () =>
      import('flusysng/pages').then((com) => com.ErrorComponent),
  },
  {
    path: 'access',
    loadComponent: () =>
      import('flusysng/pages').then((com) => com.AccessComponent),
  },
  {
    path: 'notfound',
    loadComponent: () =>
      import('flusysng/pages').then((com) => com.NotfoundComponent),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/notfound',
    pathMatch: 'full',
  },
];
