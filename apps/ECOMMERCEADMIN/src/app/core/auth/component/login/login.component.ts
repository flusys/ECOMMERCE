import { Component, Input, inject } from '@angular/core';
import { PrimeModule, AngularModule } from 'flusysng/shared/modules';
import { AuthenticationFormService } from '../../service/authentication-form.service';
import { FormGroup } from '@angular/forms';
import { AuthenticationApiService } from '../../service/authentication-api.service';
import {
  AuthenticationApiService as LibAuthApi,
  AuthenticationStateService as LibAuthState,
} from 'flusysng/auth/services';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PrimeModule, AngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthenticationFormService],
})
export class LoginComponent {
  private authenticationFormService = inject(AuthenticationFormService);
  private authenticationApiService = inject(AuthenticationApiService);
  private libAuthApi = inject(LibAuthApi);
  private libAuthState = inject(LibAuthState);
  private messageService = inject(MessageService);

  @Input() requestUrl!: string;

  constructor() {
    this.authenticationFormService.initLoginForm();
  }

  get loginForm(): FormGroup {
    return this.authenticationFormService.loginForm;
  }

  login() {
    if (this.loginForm.invalid) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Something wrong in form validation.',
      });
    }
    this.authenticationApiService
      .login(this.loginForm.value)
      .subscribe((res) => {
        if (res.success) {
          this.libAuthState.loginUserData.set(res.result);
          if (this.requestUrl) this.libAuthApi.redirectBase(this.requestUrl);
          else {
            this.libAuthApi
              .checkRequestCompanyApp()
              .pipe(take(1))
              .subscribe((res) => {
                this.libAuthApi.redirectBase(this.requestUrl);
              });
          }
        } else {
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Sorry!',
            detail: res.message,
          });
        }
      });
  }
}
