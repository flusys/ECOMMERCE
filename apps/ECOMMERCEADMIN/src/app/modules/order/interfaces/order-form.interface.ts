import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IOrderForm extends ICommonForm {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    address: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
}