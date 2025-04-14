import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interface/authentication-data';
import { IUserLoginResponsePayload } from 'flusysng/shared/interfaces';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  private http = inject(HttpClient);

  baseUrl = environment.apiGatewayUrl + '/user';

  login(data: ILogin) {
    return this.http.post<IUserLoginResponsePayload & { data: any, token: string }>(this.baseUrl + '/login', data);
  }

  checkLogin() {
    return this.http.get<any>(this.baseUrl + "/check-login");
  }

}
