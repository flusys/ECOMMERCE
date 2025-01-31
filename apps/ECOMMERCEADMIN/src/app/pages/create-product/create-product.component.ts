import { Component, effect, ElementRef, inject, input, viewChild, viewChildren } from '@angular/core';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { ParentInformationCreateComponent } from '../../modules/product/components/parent-information-create/parent-information-create.component';
import { ChildInformationCreateComponent } from '../../modules/product/components/child-information-create/child-information-create.component';
import { NgForm, FormControlName, FormArray, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../modules/product/services/product-api.service';
import { ProductFormService } from '../../modules/product/services/product-form.service';
import { Router } from '@angular/router';
import { IParentProductForm, IProductForm } from '../../modules/product/interfaces/product-form.interface';
import { ProductStateService } from '../../modules/product/services/product-state.service';
import { ICategory } from '../../modules/category/interfaces/category-data.interface';
import { ITag } from '../../modules/tag/interfaces/tag-data.interface';

@Component({
  selector: 'app-create-product',
  imports: [
    PrimeModule,
    AngularModule,
    ParentInformationCreateComponent,
    ChildInformationCreateComponent
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent {
  // Data Form Section
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  //Static Data For Step
  activeIndex = 0;
  isEdit: boolean = false;
  subscription!: Subscription;
  PRODUCT_PAGE_STEP: { label: string }[] = [
    { label: 'Main Information' },
    { label: 'Attribute Information' },
  ]

  //Injectin Service
  private productApiService = inject(ProductApiService);
  private productStateService = inject(ProductStateService);
  public productFormService = inject(ProductFormService)
  private messageService = inject(MessageService)
  private router = inject(Router)


  constructor() {
    effect(() => {
      const model: any = this.productStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.isEdit = true;
        this.productApiService.getParentProductById(model.parentProduct._id).subscribe(res => {
          const data = res.result;
          this.productStateService.setState({ editModelParentData: data });
          this.productFormService.patchValue({
            ...data,
            ...{
              brand: data.brand?.id,
              company: data.company?.id,
              category: data.category?.id,
              tags: data.tags?.map((tag: ITag) => tag.id),
            }
          });
        })
      } else {
        this.isEdit = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }


  get parentInformationFrom(): FormGroup<IParentProductForm> {
    return this.productFormService.formGroup;;
  }

  get chieldArrayForm(): FormArray<FormGroup<IProductForm>> {
    return this.productFormService.control("chields") as FormArray<FormGroup<IProductForm>>;
  }

  change(event: number) {
    this.activeIndex = event;
  }

  clearInputForm() {
    this.productFormService.reset();
    this.inputForm().reset();
    (this.productFormService.control("specifications") as FormArray).clear();
    (this.productFormService.control("chields") as FormArray).clear();
    this.isEdit = false;
  }

  onSubmit() {
    if (this.productFormService.formGroup.invalid) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "Please Fill Form Correctly" });
      return;
    } else {
      if (this.isEdit) {
        this.productApiService.updateParentProduct(this.productFormService.value).subscribe(res => {
          if (res.success)
            this.router.navigate(['/product-list'])
          else
            this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
        })
      } else {
        this.productApiService.createParentProduct(this.productFormService.value).subscribe(res => {
          if (res.success)
            this.router.navigate(['/product-list'])
          else
            this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
        })
      }
    }
  }
}
