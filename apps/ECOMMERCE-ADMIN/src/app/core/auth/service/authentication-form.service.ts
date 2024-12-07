import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ILoginForm, IRegisterForm } from "../interface/authentication-form";

@Injectable()
export class AuthenticationFormService {

  loginForm!: FormGroup;
  registerForm: FormGroup<IRegisterForm> = new FormGroup<IRegisterForm>(<IRegisterForm>{
    name: new FormControl<string>('', [
      Validators.required,
    ]),
    email: new FormControl<string>('', [
      Validators.required,
    ]),
    profilePic: new FormControl<string>(''),
   
    gender: new FormControl<string>('MALE', [
      Validators.required,
    ]),
    isVerified: new FormControl(false, {nonNullable: true}),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    referCode: new FormControl(''),
  });

  constructor() {
  }

  /**
   * This is a sample function that initialize from group.
   */
  initLoginForm() {
    this.loginForm = new FormGroup<ILoginForm>(<ILoginForm>{
      username: new FormControl<string>('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
