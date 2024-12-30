import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { ICommonForm } from "flusysng/shared/interfaces";

export interface IParentProductForm extends ICommonForm {
    name: FormControl<string>;
    slug: FormControl<string>;
    images: FormControl<string[]>;
    isHtml: FormControl<boolean>;
    description: FormControl<string>;
    shortDesc: FormControl<string>;
    serial: FormControl<string>;
    seoTitle: FormControl<string>;
    seoDescription: FormControl<string>;
    seoKeywords: FormControl<string[]>;
    videoUrl: FormControl<string>;
    videoThumbnailImage: FormControl<string>;
    specifications: FormArray<FormGroup<ISpecificationForm>>;
    category: FormControl<number>;
    brand: FormControl<number>;
    company: FormControl<number>;
    tags: FormControl<number[]>;
    isFeature: FormControl<boolean>;
    status: FormControl<string>;
    isActive: FormControl<boolean>;
    chields: FormArray<FormGroup<IProductForm>>;
}

export interface ISpecificationForm {
    key: FormControl<string>;
    value: FormControl<string>;
}

export interface IProductForm extends ICommonForm {
    readOnly: FormControl<boolean>;
    image: FormControl<string>;
    warning: FormControl<string>;
    warningDay: FormControl<number>;
    refundable: FormControl<boolean>;
    returnable: FormControl<boolean>;
    taxType: FormControl<number>;
    taxAmount: FormControl<number>;
    sku: FormControl<string>;
    barCode: FormControl<string>;
    price: FormControl<number>;
    orderLimit: FormControl<number>;
    ingredients: FormArray<FormGroup<IIngredientsForm>>;
    trackQuantity: FormControl<number>;
    stockQuantity: FormControl<number>;
    earnPoint: FormControl<number>;
    status: FormControl<string>;
    isActive: FormControl<boolean>;
    activeOnline: FormControl<boolean>;
    variants: FormControl<number[]>;
}

export interface IIngredientsForm {
    key: FormControl<string>;
    value: FormControl<string>;
}