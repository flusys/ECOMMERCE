import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { LIB_CONFIG } from 'flusysng';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { NavyBlueTheme } from 'flusysng/core/theme';
import { includeTokenInHeader } from './core/interceptors/with-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([includeTokenInHeader]),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: NavyBlueTheme,
      },
    }),
    MessageService,
    { provide: LIB_CONFIG, useValue: environment },
  ]
};
