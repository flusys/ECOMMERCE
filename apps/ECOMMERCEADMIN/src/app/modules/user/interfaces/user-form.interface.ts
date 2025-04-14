import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IUserForm extends ICommonForm {
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    address: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    password: FormControl<string>;
    hasAccess: FormControl<boolean>;
}