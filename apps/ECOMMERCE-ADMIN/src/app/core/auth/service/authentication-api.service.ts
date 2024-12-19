import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ILogin } from '../interface/authentication-data';
import { Observable } from 'rxjs';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { environment } from 'apps/ECOMMERCE-ADMIN/src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  private http = inject(HttpClient);

  baseUrl = environment.apiGatewayUrl + '/auth';

  login(data: ILogin): Observable<IResponsePayload<any>> {
    return this.http.post<IResponsePayload<any>>(this.baseUrl + '/login', data);
  }

}
