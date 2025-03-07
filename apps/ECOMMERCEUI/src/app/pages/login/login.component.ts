import { Component, inject } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../modules/auth/services/auth-api.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submitted = false;


  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  authApiService: AuthApiService = inject(AuthApiService);
  authStateService: AuthStateService = inject(AuthStateService);

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.authApiService.login(this.loginForm.value).subscribe(res => {
      if(res.success){
        this.authStateService.loginUserData.set(res.data);
        localStorage.setItem('token', res['token']);
        this.router.navigate(['/']);
      }
    });
  }
}
