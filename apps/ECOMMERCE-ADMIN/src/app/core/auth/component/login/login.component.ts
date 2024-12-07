import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationFormService } from '../../service/authentication-form.service';
import { AuthenticationApiService } from '../../service/authentication-api.service';
import { AuthenticationStateService } from '../../service/authentication-state.service';
import { PrimeModule, AngularModule } from 'libs/shared/src';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PrimeModule,
    AngularModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthenticationFormService ],
})
export class LoginComponent {
  @Input() requestUrl!: string;

  constructor(private authenticationFormService: AuthenticationFormService,
    private authenticationApiService: AuthenticationApiService,
    private authenticationStateService: AuthenticationStateService,
    private messageService: MessageService) {
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
    this.authenticationApiService.login(this.loginForm.value).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: "Authorized! Success." });
        this.authenticationStateService.loginUserData.set(res.result);
        this.authenticationStateService.setToken(res.result.token);
        this.authenticationStateService.navigateBaseUrl();
      } else {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Sorry!', detail: res.message });
      }
    });
  }

}
