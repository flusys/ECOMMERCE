import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IAttributeValue } from '../interfaces/attribute-value-data.interface';
import { IAttributeValueForm } from '../interfaces/attribute-value-form.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeValueApiService extends ApiService<ɵFormGroupValue<IAttributeValueForm>,IAttributeValue> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("attribute-value", http)
    this.http = http;
  }
}
