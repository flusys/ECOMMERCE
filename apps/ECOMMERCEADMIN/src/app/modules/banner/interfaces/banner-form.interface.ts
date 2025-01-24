import { FormControl } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IBannerForm extends ICommonForm {
    type: FormControl<string>;
    url: FormControl<string>;
    title: FormControl<string>;
    subTitle: FormControl<string>;
    image: FormControl<string>;
    serial: FormControl<number>;
}