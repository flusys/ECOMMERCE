import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';
import { Observable } from 'rxjs';
import { IFilterData, IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl + '/product';
  constructor() { }

  getAll(search: string, body: IFilterData): Observable<IResponsePayload<any[]>> {
    return this.http.post<IResponsePayload<any[]>>(this.baseUrl + "/get-all", body);
  }

}
