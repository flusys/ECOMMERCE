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
import { Router } from '@angular/router';

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
  private libAuthState = inject(LibAuthState);
  private messageService = inject(MessageService);
  private router=inject(Router)

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
          this.libAuthState.loginUserData.set(res.data);
          localStorage.setItem('token',res.token);
          this.router.navigate(['/dashboard']);
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
