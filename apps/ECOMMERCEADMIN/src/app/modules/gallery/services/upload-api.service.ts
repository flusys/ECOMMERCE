import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/ECOMMERCEADMIN/src/environments/environment';
import { IFileResponsePayload } from 'flusysng/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UploadApiService {
  private http: HttpClient = inject(HttpClient);
  private baseUrl = environment.apiGatewayUrl + '/upload';
  constructor() { }

  uploadSingleImage(data: FormData) {
    return this.http.post<{
      originalname: string,
      filename: string,
      url: string,
    }>(this.baseUrl + "/single-image", data);
  }

  uploadMultipleImages(data: FormData, folderPath: string) {
    return this.http.post<IFileResponsePayload[]>(this.baseUrl + "/multiple-image?folderPath=" + folderPath, data);
  }

}
