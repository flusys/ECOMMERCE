import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {IResponsePayload} from "flusysng/shared/interfaces";

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
