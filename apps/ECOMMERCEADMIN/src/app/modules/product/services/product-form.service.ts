import { inject, Injectable } from '@angular/core';
import { IIngredientsForm, IParentProductForm, IProductForm, ISpecificationForm } from '../interfaces/product-form.interface';
import { FormCommonClass } from 'flusysng/shared/classes';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ProductFormService extends FormCommonClass<IParentProductForm> {
  protected override messageService: MessageService;

  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IParentProductForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      slug: new FormControl('', { nonNullable: true }),
      category: new FormControl(0, { nonNullable: true }),
      brand: new FormControl(0, { nonNullable: true }),
      company: new FormControl(0, { nonNullable: true }),
      tags: new FormControl([], { nonNullable: true }),
      isFeature: new FormControl(false, { nonNullable: true }),
      shortDesc: new FormControl('', { nonNullable: true }),
      serial: new FormControl('', { nonNullable: true }),
      isHtml: new FormControl(false, { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      seoTitle: new FormControl('', { nonNullable: true }),
      seoDescription: new FormControl('', { nonNullable: true }),
      seoKeywords: new FormControl([], { nonNullable: true }),
      videoUrl: new FormControl('', { nonNullable: true }),
      videoThumbnailImage: new FormControl('', { nonNullable: true }),
      specifications: new FormArray<FormGroup<ISpecificationForm>>([this.specificationsFormGroup]),
      status: new FormControl('', { nonNullable: true }),
      isActive: new FormControl(true, { nonNullable: true }),
      images: new FormControl([], { nonNullable: true }),
      chields: new FormArray<FormGroup<IProductForm>>([]),
    });
  }

  get specificationsFormGroup() {
    return new FormGroup<ISpecificationForm>({
      key: new FormControl('', { nonNullable: true }),
      value: new FormControl('', { nonNullable: true }),
    });
  }

  get productFormGroup() {
    return new FormGroup<IProductForm>({
      id: new FormControl(0, { nonNullable: true }),
      price: new FormControl(0, { nonNullable: true }),
      readOnly: new FormControl(false, { nonNullable: true }),
      sku: new FormControl('', { nonNullable: true }),
      barCode: new FormControl('', { nonNullable: true }),
      trackQuantity: new FormControl(0, { nonNullable: true }),
      stockQuantity: new FormControl(0, { nonNullable: true }),
      orderLimit: new FormControl(0, { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
      warning: new FormControl('', { nonNullable: true }),
      warningDay: new FormControl(0, { nonNullable: true }),
      earnPoint: new FormControl(0, { nonNullable: true }),
      refundable: new FormControl(false, { nonNullable: true }),
      returnable: new FormControl(false, { nonNullable: true }),
      isActive: new FormControl(false, { nonNullable: true }),
      activeOnline: new FormControl(false, { nonNullable: true }),
      status: new FormControl('', { nonNullable: true }),
      ingredients: new FormArray<FormGroup<IIngredientsForm>>([this.ingredientsFromGroup]),
      variants: new FormControl([], { nonNullable: true }),
      taxType: new FormControl(0, { nonNullable: true }),
      taxAmount: new FormControl(0, { nonNullable: true }),
    });
  }


  get ingredientsFromGroup() {
    return new FormGroup<ISpecificationForm>({
      key: new FormControl('', { nonNullable: true }),
      value: new FormControl('', { nonNullable: true }),
    });
  }
}