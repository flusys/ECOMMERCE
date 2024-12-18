import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { routes } from './app.routes';

import {
  apiLoaderInterceptor,
  errorCatchingInterceptor,
  withCredentials,
} from 'flusysng/core/interceptors';
import { ApiLoaderService } from 'flusysng/core/services';
import { LIB_CONFIG } from 'flusysng';
import { environment } from '../environments/environment';
import { providePrimeNG } from 'primeng/config';
import { NavyBlueTheme } from 'flusysng/core/theme';

export let appConfig: ApplicationConfig;
appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'disabled',
        anchorScrolling: 'enabled',
      }),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        onSameUrlNavigation: 'reload',
      }),
      withComponentInputBinding(),
      withViewTransitions(),
    ),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        withCredentials,
        errorCatchingInterceptor,
        apiLoaderInterceptor,
      ]),
    ),
    providePrimeNG({
      theme: {
        preset: NavyBlueTheme,
      },
    }),
    MessageService,
    ApiLoaderService,
    { provide: LIB_CONFIG, useValue: environment },
  ],
};
