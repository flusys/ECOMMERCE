import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IPost } from '../interfaces/psot-data.interface';
import { IPostForm } from '../interfaces/post-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PostApiService extends ApiService<ɵFormGroupValue<IPostForm>, IPost> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("post", http)
    this.http = http;
  }
}
