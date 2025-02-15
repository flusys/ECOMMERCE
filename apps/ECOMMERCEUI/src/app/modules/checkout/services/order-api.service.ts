import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService } from 'flusysng/shared/classes';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService extends ApiService<any,any> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("order-details", http)
    this.http = http;
  }
}
