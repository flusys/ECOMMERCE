import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ɵFormGroupValue } from '@angular/forms';
import {ILoginForm, IRegisterForm} from '../interface/authentication-form';
import { ILoggedUserInfo } from '../interface/logged-user-info.interface';
import { IReferCodeDetails } from '../interface/refer-code-details.interface';
import {IResponsePayload} from "flusysng/shared/interfaces";


@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  baseUrl = environment.apiGatewayUrl + '/v1/auth';
  baseUserUrl = environment.apiGatewayUrl + '/v1/user';

  constructor(private http: HttpClient) {}

  login(data: ɵFormGroupValue<ILoginForm>): Observable<IResponsePayload<ILoggedUserInfo>> {
    return this.http.post<IResponsePayload<ILoggedUserInfo>>(this.baseUrl + '/authenticate', data);
  }

  register(data: ɵFormGroupValue<IRegisterForm>): Observable<IResponsePayload<String>> {
    return this.http.post<IResponsePayload<String>>(this.baseUrl + '/registration', data);
  }

  verifyAndChangePassword(changePassObj: object): Observable<IResponsePayload<string>> {
    return this.http.post<IResponsePayload<string>>(this.baseUrl + '/verify-and-change-password', changePassObj);
  }

  getReferCodeDetails(code:string): Observable<IResponsePayload<IReferCodeDetails>> {
    return this.http.get<IResponsePayload<IReferCodeDetails>>(this.baseUrl + `/get-refer-code-details-for-register/${code}`);
  }

  checkUserLogin(): Observable<IResponsePayload<ILoggedUserInfo>> {
    return this.http.get<IResponsePayload<ILoggedUserInfo>>(this.baseUserUrl + '/check-login');
  }

}
