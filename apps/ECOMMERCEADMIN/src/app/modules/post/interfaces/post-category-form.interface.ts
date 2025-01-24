import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IPostCategoryForm extends ICommonForm {
    name: FormControl<string>;
}