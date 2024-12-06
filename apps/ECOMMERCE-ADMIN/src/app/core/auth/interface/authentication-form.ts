import {FormControl, FormGroup} from "@angular/forms";
import { ILineageForm } from "src/app/modules/lineage/interfaces/lineage-form";

export interface ILoginForm {
  username: FormControl<string>;
  password: FormControl<string>;
}

export interface IRegisterForm {
  name: FormControl<string>;
  email: FormControl<string>;
  profilePic: FormControl<string>;
  role: FormControl<string>;
  gender: FormControl<string>;
  isVerified: FormControl<boolean>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  referCode: FormControl<string>;
  lineage: FormGroup<ILineageForm>;
}
