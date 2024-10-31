import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
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
    path: 'wish-list',
    loadComponent: () =>
      import('./pages/wish-list/wish-list.component').then(
        (m) => m.WishListComponent
      ),
  },{
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then(
        (m) => m.CartComponent
      ),
  },{
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
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
    path: 'notfound',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (com) => com.NotFoundComponent
      ),
  },
  { path: '**', redirectTo: '/notfound', pathMatch: 'full' },
];
