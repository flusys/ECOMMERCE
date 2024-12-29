import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface ITagForm extends ICommonForm {
    name: FormControl<string>;
    priority: FormControl<number>;
    image: FormControl<string>;
}