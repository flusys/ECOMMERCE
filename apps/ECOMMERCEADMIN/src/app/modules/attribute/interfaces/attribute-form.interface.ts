import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IAttributeForm extends ICommonForm {
    name: FormControl<string>;
}