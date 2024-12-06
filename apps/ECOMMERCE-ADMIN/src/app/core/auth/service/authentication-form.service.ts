import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ILoginForm, IRegisterForm } from "../interface/authentication-form";
import { LineageFormService } from "../../../modules/lineage/services/lineage-form.service";
import { RoleEnum } from '@shared/enums/role.enum';

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
    role: new FormControl<string>(RoleEnum.ADMIN, [
      Validators.required,
    ]),
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
    lineage: this.lineageFormService.formGroup
  });

  constructor(private lineageFormService: LineageFormService) {
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
