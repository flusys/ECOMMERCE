import { inject, Injectable } from '@angular/core';
import { ICompanyForm } from '../interfaces/company-form.interface';
import { ICompany } from '../interfaces/company-data.interface';
import { HttpClient } from '@angular/common/http';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';

@Injectable({
  providedIn: 'root'
})
export class CompanyApiService  extends ApiService<ɵFormGroupValue<ICompanyForm>,ICompany> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("company", http)
    this.http = http;
  }
}
