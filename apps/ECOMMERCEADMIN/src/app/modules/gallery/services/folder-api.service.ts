import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IFolder } from '../interfaces/folder-data.interface';
import { IFolderForm } from '../interfaces/folder-form.interface';

@Injectable({
  providedIn: 'root'
})
export class FolderApiService extends ApiService<ɵFormGroupValue<IFolderForm>,IFolder> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("folder", http)
    this.http = http;
  }
}
