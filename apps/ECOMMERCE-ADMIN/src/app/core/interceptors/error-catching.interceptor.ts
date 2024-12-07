import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs/operators';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthenticationStateService } from '../auth/service/authentication-state.service';
import {PlatformService} from "flusysng/shared/services";
import { environment } from 'apps/ECOMMERCE-ADMIN/src/environments/environment';

export function errorCatchingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const messageService = inject(MessageService);
  const platformService = inject(PlatformService);
  const authenticationStateService = inject(AuthenticationStateService);

  return next(req).pipe(
    map((res) => {
      return res;
    }),
    tap({
      error: (error) => {
        if (error.status === 401 && !req.url.includes(environment.checkUserLoginEndPoint)) {
          authenticationStateService.loginUserData.set(null);
          authenticationStateService.removeToken();
          authenticationStateService.navigateLogin();
        }
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (!platformService.isServer && !req.url.includes(environment.checkUserLoginEndPoint)) {
        if (error.status === 401) {
          messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'Your are not authenticate or your session has expired. Please log in again.',
          });
        } else
          messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: error.error.message });
        return throwError(error);
      }
      // Handle other errors:
      return throwError(error);
    }),
  );
}
