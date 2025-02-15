import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IOrderForm extends ICommonForm {
    name: FormControl<string>;
    address: FormControl<string>;
    image: FormControl<string>;
}