import { Component, ElementRef, inject, input, viewChild, viewChildren } from '@angular/core';
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
  //Get Params
  id = input(0);

  // Data Form Section
  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  //Static Data For Step
  activeIndex = 1;
  isEdit: boolean = false;
  subscription!: Subscription;
  PRODUCT_PAGE_STEP: { label: string }[] = [
    { label: 'Main Information' },
    { label: 'Attribute Information' },
  ]

  //Injectin Service
  private productApiService = inject(ProductApiService);
  public productFormService = inject(ProductFormService)
  private messageService = inject(MessageService)
  private router = inject(Router)

  ngOnInit() {
    if (this.id && this.id() != 0) {
      this.isEdit = true;
    }
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

    }
  }
}
