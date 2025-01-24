import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IBannerForm } from '../interfaces/banner-form.interface';
import { IBanner } from '../interfaces/banner-data.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerApiService  extends ApiService<ɵFormGroupValue<IBannerForm>, IBanner> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("banner", http)
    this.http = http;
  }
}