import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IFolderForm extends ICommonForm {
    name: FormControl<string>;
    serial: FormControl<number>;
}
