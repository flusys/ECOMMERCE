import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { MessageService } from "primeng/api";
import { AuthenticationApiService } from '../auth/service/authentication-api.service';
import { AuthenticationStateService } from '../auth/service/authentication-state.service';
import { MenuStateService } from '../layout/services/menu-state.service';
import {PlatformService} from "flusysng/shared/services";

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authenticationStateService = inject(AuthenticationStateService);
  const authenticationApiService = inject(AuthenticationApiService);
  const menuStateService = inject(MenuStateService);
  const messageService = inject(MessageService);
  const platformService = inject(PlatformService);
  const router = inject(Router);

  if (!authenticationStateService.isInitLoad)
    return of(true);

  authenticationStateService.isInitLoad = false;

  return authenticationApiService.checkUserLogin().pipe(
    switchMap(userData => {
      if (userData && userData.success) {
        authenticationStateService.loginUserData.set(userData.result);
        if (!platformService.isServer) {
          authenticationStateService.navigateBaseUrl();
          messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: "Authorized! Success." });
        }
        return of(true);
      } else {
        authenticationStateService.loginUserData.set(null);
        return of(false);
      }
    }), catchError((err) => {
      authenticationStateService.loginUserData.set(null);
      if (!platformService.isServer) {
        const pathName = window.location.pathname;
        if (!pathName.includes('/auth')) {
          if (err.status === 401)
            messageService.add({ key: 'tst', severity: 'error', summary: 'Unauthorized!', detail: 'Please, Login First .' });
          else
            messageService.add({ key: 'tst', severity: 'error', summary: 'Unauthorized!', detail: 'Request forbidden.' });

          authenticationStateService.removeToken();
          router.navigate(['/auth/login']);
          return of(false);
        }else{
          return of(true);
        }

      }
      return of(false);
    },
    ),
  );
};
