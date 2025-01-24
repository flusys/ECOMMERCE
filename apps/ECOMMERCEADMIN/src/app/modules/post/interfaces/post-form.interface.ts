import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IPostForm extends ICommonForm {
    title: FormControl<string>;
    isHtml: FormControl<boolean>;
    description: FormControl<string>;
    image: FormControl<string>;
    category: FormControl<number>;
}