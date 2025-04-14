import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { MessageService } from "primeng/api";
import { AuthenticationApiService } from '../auth/service/authentication-api.service';
import { PlatformService } from "flusysng/shared/services";
import { AuthenticationStateService } from 'flusysng/auth/services';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authenticationStateService = inject(AuthenticationStateService);
  const authenticationApiService = inject(AuthenticationApiService);
  const messageService = inject(MessageService);
  const platformService = inject(PlatformService);
  const router = inject(Router);

  if (!authenticationStateService.isInitLoad)
    return of(true);

  authenticationStateService.isInitLoad = false;

  return authenticationApiService.checkLogin().pipe(
    switchMap(userData => {
      if (userData) {
        authenticationStateService.loginUserData.set(userData);
        if (!platformService.isServer) {
          router.navigate(['/dashboard']);
          messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: "Authorized! Success." });
        }
        return of(true);
      } else {
        localStorage.removeItem('token');
        router.navigate(['/auth/login']);
        return of(false);
      }
    }), catchError((err) => {
      if (!platformService.isServer) {
        const pathName = window.location.pathname;
        if (!pathName.includes('/auth')) {
          if (err.status === 401)
            messageService.add({ key: 'tst', severity: 'error', summary: 'Unauthorized!', detail: 'Please, Login First .' });
          else
            messageService.add({ key: 'tst', severity: 'error', summary: 'Unauthorized!', detail: 'Request forbidden.' });
          localStorage.removeItem('token');
          router.navigate(['/auth/login']);
          return of(false);
        } else {
          return of(true);
        }
      }
      return of(false);
    },
    ),
  );
};
