import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IBrandForm extends ICommonForm {
    isActive: FormControl<boolean>;
    name: FormControl<string>;
    description: FormControl<string>;
    image: FormControl<string>;
    serial: FormControl<number>;
}