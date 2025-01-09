import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IGalleryForm extends ICommonForm {
    name: FormControl<string>;
    url: FormControl<string>;
    folder: FormControl<number>;
    size: FormControl<string>;
    type: FormControl<string>;
}
