import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IPostCategory } from '../interfaces/post-category-data.interface';
import { IPostCategoryForm } from '../interfaces/post-category-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PostCategoryApiService extends ApiService<ɵFormGroupValue<IPostCategoryForm>,IPostCategory> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("post-category", http)
    this.http = http;
  }
}
