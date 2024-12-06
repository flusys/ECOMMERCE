import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

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
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (com) => com.DashboardComponent
          ),
      },
      {
        path: 'family-tree',
        loadComponent: () =>
          import('./pages/family-tree/family-tree.component').then(
            (com) => com.FamilyTreeComponent
          ),
      },
      {
        path: 'lineage',
        loadComponent: () =>
          import('./pages/lineage/lineage.component').then(
            (com) => com.LineageComponent
          ),
      },
      {
        path: 'refer-user',
        loadComponent: () =>
          import('./pages/refer-user/refer-user.component').then(
            (com) => com.ReferUserComponent
          ),
        loadChildren: () => [
          {
            path: 'generate-link',
            loadComponent: () =>
              import(
                './pages/refer-user/generate-link/generate-link.component'
              ).then((com) => com.GenerateLinkComponent),
          },
          {
            path: 'refer-user-list',
            loadComponent: () =>
              import(
                './pages/refer-user/refer-user-list/refer-user-list-page.component'
              ).then((com) => com.ReferUserListPageComponent),
          },
        ],
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./pages/user/user.component').then(
            (com) => com.UserComponent
          ),
        loadChildren: () => [
          {
            path: 'user-list',
            loadComponent: () =>
              import(
                './pages/user/user-list-page/user-list-page.component'
              ).then((com) => com.UserListPageComponent),
          },
        ],
      },
      {
        path: 'address-setup',
        loadComponent: () =>
          import('./pages/address-setup/address-setup.component').then(
            (com) => com.AddressSetupComponent
          ),
        loadChildren: () => [
          {
            path: 'continent-setup',
            loadComponent: () =>
              import(
                './pages/address-setup/continent-setup/continent-setup.component'
              ).then((com) => com.ContinentSetupComponent),
          },
          {
            path: 'country-setup',
            loadComponent: () =>
              import(
                './pages/address-setup/country-setup/country-setup.component'
              ).then((com) => com.CountrySetupComponent),
          },
          {
            path: 'division-setup',
            loadComponent: () =>
              import(
                './pages/address-setup/division-setup/division-setup.component'
              ).then((com) => com.DivisionSetupComponent),
          },
          {
            path: 'district-setup',
            loadComponent: () =>
              import(
                './pages/address-setup/district-setup/district-setup.component'
              ).then((com) => com.DistrictSetupComponent),
          },
          {
            path: 'sub-district-setup',
            loadComponent: () =>
              import(
                './pages/address-setup/sub-district-setup/sub-district-setup.component'
              ).then((com) => com.SubDistrictSetupComponent),
          },
        ],
      },
      {
        path: 'user-payment',
        loadComponent: () =>
          import('./pages/user-payment/user-payment.component').then(
            (com) => com.UserPaymentComponent
          ),
        loadChildren: () => [
          {
            path: 'submit-payment-information',
            loadComponent: () =>
              import(
                './pages/user-payment/submit-payment-information/submit-payment-information.component'
              ).then((com) => com.SubmitPaymentInformationComponent),
          },

          {
            path: 'payment-information-list',
            loadComponent: () =>
              import(
                './pages/user-payment/payment-information-list/payment-information-list.component'
              ).then((com) => com.PaymentInformationListComponent),
          },
        ],
      },
      {
        path: 'reviewer',
        loadComponent: () =>
          import('./pages/reviewer/reviewer.component').then(
            (com) => com.ReviewerComponent
          ),
      },
      {
        path: 'basic-information',
        loadComponent: () =>
          import('./pages/basic-information/basic-information.component').then(
            (com) => com.BasicInformationComponent
          ),
      },
    ],
  },
  {
    path: 'terms-and-condition',
    loadComponent: () =>
      import('./pages/terms-and-condition/terms-and-condition.component').then(
        (com) => com.TermsAndConditionComponent
      ),
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
    path: 'hello-world',
    loadComponent: () =>
      import('./pages/hello-world/hello-world.component').then(
        (com) => com.HelloWorldComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/notfound',
    pathMatch: 'full',
  },
];
