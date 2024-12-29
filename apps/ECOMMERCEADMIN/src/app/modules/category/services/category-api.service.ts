import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { ICategory } from '../interfaces/category-data.interface';
import { ICategoryForm } from '../interfaces/category-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryApiService extends ApiService<ɵFormGroupValue<ICategoryForm>,ICategory> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("category", http)
    this.http = http;
  }
}
