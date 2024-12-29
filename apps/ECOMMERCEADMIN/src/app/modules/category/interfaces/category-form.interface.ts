import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface ICategoryForm extends ICommonForm {
    name: FormControl<string>;
    image: FormControl<string>;
    description: FormControl<string>;
    parent: FormControl<number>;
}