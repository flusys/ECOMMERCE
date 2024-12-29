import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IAttributeValueForm extends ICommonForm {
    name: FormControl<string>;
    attribute: FormControl<number>;
}