import {Injectable} from '@angular/core';
import { FormControl, FormGroup, Validators} from "@angular/forms";
import {ILoginForm} from "../interface/authentication-form";

@Injectable()
export class AuthenticationFormService {

  loginForm!: FormGroup;
  registrationForm!: FormGroup;

  constructor() {
  }

  /**
   * This is a sample function that initialize from group.
   */
  initLoginForm() {
    this.loginForm = new FormGroup<ILoginForm>(<ILoginForm>{
      email: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      rememberMe: new FormControl(false, {nonNullable: true}),
    });
  }

}
