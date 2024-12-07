import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IResponsePayload} from "flusysng/shared/interfaces";
import { environment } from 'apps/ECOMMERCE-ADMIN/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  baseUrl = environment.apiGatewayUrl + '/v1/user-session';
  constructor(private http: HttpClient) {
  }

  getCurrentSession(): Observable<IResponsePayload<string>> {
    return this.http.get<IResponsePayload<string>>(this.baseUrl + '/get-current-session');
  }

}
