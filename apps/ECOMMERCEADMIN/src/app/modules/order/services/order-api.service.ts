import { inject, Injectable } from '@angular/core';
import { IOrderForm } from '../interfaces/order-form.interface';
import { IOrderDetails } from '../interfaces/order-data.interface';
import { HttpClient } from '@angular/common/http';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService  extends ApiService<ɵFormGroupValue<IOrderForm>,IOrderDetails> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("order-details", http)
    this.http = http;
  }
}
