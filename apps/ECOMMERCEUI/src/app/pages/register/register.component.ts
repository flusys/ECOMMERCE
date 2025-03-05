import { Component, inject } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../modules/auth/services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;

  formBuilder: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  authStateService: AuthApiService = inject(AuthApiService);

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.authStateService.signup(this.registerForm.value).subscribe(res => {
      if (res.success) {
        this.router.navigate(['/']);
      }
    });
  }
}
