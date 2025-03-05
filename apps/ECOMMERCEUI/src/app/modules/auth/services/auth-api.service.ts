import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';
import { IFilterData, IResponsePayload } from 'flusysng/shared/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl + '/user';
  constructor() { }

  login(body: any): Observable<IResponsePayload<any>> {
    return this.http.post<IResponsePayload<any>>(this.baseUrl + "/login", body);
  }

  signup(body: any): Observable<IResponsePayload<any>> {
    return this.http.post<IResponsePayload<any>>(this.baseUrl + "/signup", body);
  }
}
