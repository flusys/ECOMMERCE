import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IGallery } from '../interfaces/gallery-data.interface';
import { IGalleryForm } from '../interfaces/gallery-form.interface';
import { IResponsePayload } from 'flusysng/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class GalleryApiService extends ApiService<ɵFormGroupValue<IGalleryForm>, IGallery> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("gallery", http)
    this.http = http;
  }

  insertMany(data: any[]) {
    return this.http.post<IResponsePayload<string>>(this.baseUrl + "/insert-many", data);
  }
}
