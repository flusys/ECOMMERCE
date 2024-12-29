import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { ITag } from '../interfaces/tag-data.interface';
import { ITagForm } from '../interfaces/tag-form.interface';

@Injectable({
  providedIn: 'root'
})
export class TagApiService extends ApiService<ɵFormGroupValue<ITagForm>,ITag> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("tag", http)
    this.http = http;
  }
}
