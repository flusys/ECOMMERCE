import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IParentProductForm } from '../interfaces/product-form.interface';
import { ɵFormGroupValue } from '@angular/forms';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';
import { IParentProduct, IProduct } from '../interfaces/product-data.interface';
import { Observable } from 'rxjs';
import { IFilterData, IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl + '/product';
  constructor() { }

  createParentProduct(data: ɵFormGroupValue<IParentProductForm>): Observable<IResponsePayload<IParentProduct>> {
    return this.http.post<IResponsePayload<IParentProduct>>(this.baseUrl + "/insert", data);
  }

  updateParentProduct(data: ɵFormGroupValue<IParentProductForm>): Observable<IResponsePayload<IParentProduct>> {
    return this.http.post<IResponsePayload<IParentProduct>>(this.baseUrl + "/update", data);
  }

  getParentProductById(id: string): Observable<IResponsePayload<IParentProduct>> {
    return this.http.get<IResponsePayload<IParentProduct>>(this.baseUrl + "/parent-product/" + id);
  }

  getAll(search: string, body: IFilterData): Observable<IResponsePayload<IProduct[]>> {
    return this.http.post<IResponsePayload<IProduct[]>>(this.baseUrl + "/get-all", body);
  }

  deleteProduct(id: number): Observable<IResponsePayload<string>> {
    return this.http.delete<IResponsePayload<string>>(this.baseUrl + "/delete/" + id);
  }
}
