import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IParentProductForm extends ICommonForm {
    name: FormControl<string>;
    images: FormControl<string>;
    category: FormControl<number>;
    brand: FormControl<number>;
    company: FormControl<number>;
    tagIds: FormControl<number[]>;
    isHtml: FormControl<boolean>;
    description: FormControl<string>;
    shortDesc: FormControl<string>;
    serial: FormControl<string>;
    isFeature: FormControl<boolean>;
    status: FormControl<string>;
    seoTitle: FormControl<string>;
    seoDescription: FormControl<string>;
    seoKeywords: FormControl<string>;
    videoUrl: FormControl<string>;
    videoThumbnailImage: FormControl<string>;
    specifications: FormArray<FormGroup<ISpecificationForm>>;
    chields: FormArray<FormGroup<IProductForm>>;
}

export interface ISpecificationForm {
    name: FormControl<string>;
    value: FormControl<string>;
}

export interface IProductForm extends ICommonForm {
    readOnly: FormControl<boolean>;
    image: FormControl<string>;
    warning: FormControl<string>;
    warningDay: FormControl<number>;
    taxType: FormControl<number>;
    taxAmount: FormControl<number>;
    refundable: FormControl<boolean>;
    returnable: FormControl<boolean>;
    sku: FormControl<string>;
    barCode: FormControl<string>;
    price: FormControl<number>;
    orderLimit: FormControl<number>;
    ingredients: FormArray<FormGroup<IIngredientsForm>>;
    trackQuantity: FormControl<number>;
    earnPoint: FormControl<number>;
    status: FormControl<string>;
    isActive: FormControl<boolean>;
    activeOnline: FormControl<boolean>;
    variants: FormControl<number[]>;
}

export interface IIngredientsForm {
    name: FormControl<string>;
    value: FormControl<string>;
}