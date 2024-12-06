import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { AuthenticationStateService } from '../auth/service/authentication-state.service';

export function withCredentials(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authenticationStateService = inject(AuthenticationStateService);
  let modifiedReq: HttpRequest<unknown>;
  modifiedReq = req.clone({
    setHeaders: {
      Authorization:`Bearer ${authenticationStateService.getToken()??''}`
    },
  });
  return next(modifiedReq);
}
