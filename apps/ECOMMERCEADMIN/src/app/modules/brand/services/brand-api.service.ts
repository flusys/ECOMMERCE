import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IBrandForm } from '../interfaces/brand-form.interface';
import { IBrand } from '../interfaces/brand-data.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandApiService  extends ApiService<ɵFormGroupValue<IBrandForm>, IBrand> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("brand", http)
    this.http = http;
  }
}