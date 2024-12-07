import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthenticationFormService } from '../../service/authentication-form.service';
import { AuthenticationApiService } from '../../service/authentication-api.service';
import { MessageService } from 'primeng/api';
import { IRegisterForm } from '../../interface/authentication-form';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import {OpenVerifierDialogDirective} from "flusysng/shared/directives";
import { AngularModule, PrimeModule } from 'libs/shared/src';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AngularModule,
    PrimeModule,
    OpenVerifierDialogDirective,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [AuthenticationFormService],
})
export class RegisterComponent implements OnInit {
  @Input() requestUrl!: string;
  @Input() referCode!: string;

  agreed:boolean=false;

  constructor(
    private authenticationFormService: AuthenticationFormService,
    private authenticationApiService: AuthenticationApiService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  get value(): string {
    return this.authenticationFormService.registerForm.value.email ?? '';
  }

  get isVerified(): boolean {
    return (
      this.authenticationFormService.registerForm.value.isVerified ?? false
    );
  }

  setVerified(isVerified: boolean) {
    this.authenticationFormService.registerForm.patchValue({ isVerified });
  }

  callBackVerified(event: {
    message: string;
    isVerified: boolean;
    verifiedClientId: string;
  }) {
    this.setVerified(event.isVerified);
  }



  get registerForm(): FormGroup<IRegisterForm> {
    return this.authenticationFormService.registerForm;
  }

  register() {
    if (this.registerForm.invalid) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Something wrong in form validation.',
      });
    }

    if (!this.isVerified) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Your Email not verified. Please, Click verify Icon for Verify',
      });
    }

    if(!this.agreed){
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Please !',
        detail: 'Agree Terms & Condition .',
      });
    }

    const data = this.registerForm.value;
    if (data.password != data.confirmPassword)
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Confirm Password Does not match.',
      });
  }

  updateInformation() {
    this.authenticationApiService
      .register(this.registerForm.value)
      .subscribe((res) => {
        if (res.success) {
          this.messageService.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success!',
            detail: `Authorized! ${res.result}`,
          });
          this.router.navigate(['/auth/login']);
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

  files = [];
  choose(event: any, callback: any) {
    callback();
  }
  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    console.warn(this.files);
  }
}
