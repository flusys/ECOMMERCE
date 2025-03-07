import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { ApiService } from 'flusysng/shared/classes';
import { IUser } from '../interfaces/user-data.interface';
import { IUserForm } from '../interfaces/user-form.interface';
import { IResponsePayload } from 'flusysng/shared/interfaces';
import { Observable } from 'rxjs';
import { OrderStatus } from '../../order/enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends ApiService<ɵFormGroupValue<IUserForm>, IUser> {
  protected override http: HttpClient;
  constructor() {
    const http = inject(HttpClient);
    super("user", http)
    this.http = http;
  }

  updateHasAccess(data: { id: number, status: boolean }): Observable<IResponsePayload<string>> {
    return this.http.post<IResponsePayload<string>>(this.baseUrl + "/update-status", data);
  }
}
