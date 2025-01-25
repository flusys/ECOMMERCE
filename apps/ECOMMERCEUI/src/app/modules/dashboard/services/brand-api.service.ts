import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';

@Injectable({
  providedIn: 'root'
})
export class BrandApiService  extends ApiService<any, any> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("brand", http)
    this.http = http;
  }
}