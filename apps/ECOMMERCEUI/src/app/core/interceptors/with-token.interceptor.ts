import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Observable } from "rxjs";

export function includeTokenInHeader(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    let modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
      },
    });
    return next(modifiedReq);
  }
  return next(req);
}
