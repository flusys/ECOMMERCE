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

  login(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/login", body);
  }

  signup(body: any): Observable<IResponsePayload<any>> {
    return this.http.post<IResponsePayload<any>>(this.baseUrl + "/signup", body);
  }

  checkLogin(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/check-login");
  }

  myProfileInformation(): Observable<any> {
    return this.http.get<any>(this.baseUrl + "/my-profile");
  }
  updateProfile(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/update-profile", body);
  }

  changePassword(body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + "/change-password", body);
  }

}
