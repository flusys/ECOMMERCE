import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IParentProductForm } from '../interfaces/product-form.interface';
import { ɵFormGroupValue } from '@angular/forms';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';
import { IParentProduct } from '../interfaces/product-data.interface';
import { Observable } from 'rxjs';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl+'/product';
  constructor() { }

  createParentProduct(data: ɵFormGroupValue<IParentProductForm>): Observable<IResponsePayload<IParentProduct>> {
    return this.http.post<IResponsePayload<IParentProduct>>(this.baseUrl + "/insert", data);
  }

  getParentProductById(id: number): any {
    return 'Parent Product';
  }
}
