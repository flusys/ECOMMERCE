import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IAttribute } from '../interfaces/attribute-data.interface';
import { IAttributeForm } from '../interfaces/attribute-form.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeApiService extends ApiService<ɵFormGroupValue<IAttributeForm>,IAttribute> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("attribute", http)
    this.http = http;
  }
}
