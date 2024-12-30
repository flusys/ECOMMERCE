import { Component, ElementRef, input, Input, QueryList, viewChild, ViewChild, viewChildren, ViewChildren } from '@angular/core';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { ParentInformationCreateComponent } from '../../modules/product/components/parent-information-create/parent-information-create.component';
import { ChildInformationCreateComponent } from '../../modules/product/components/child-information-create/child-information-create.component';
import { NgForm, FormControlName, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ProductApiService } from '../../modules/product/services/product-api.service';
import { IParentProduct, IProduct } from '../../modules/product/interfaces/product-data.interface';
import { ProductFormService } from '../../modules/product/services/product-form.service';
import { Router } from '@angular/router';

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
  activeIndex = 0;
  isEdit: boolean = false;
  subscription!: Subscription;

  //For Edit
  parentInformation: IParentProduct | null = null;
  chields: IProduct[] = [];

  constructor(
    private productApiService: ProductApiService,
    public productFormService:ProductFormService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() {
    if (this.id && this.id() != 0) {
      this.getProductById()
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
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

  get validChields(): boolean {
    const chields = (this.productFormService.control("chields") as FormArray).value;
    let notFound: boolean = true;
    chields.map((value: { variants: any; }) => {
      let count: number = 0;
      const parentVariant = value.variants;
      chields.map((childVariant: { variants: any[]; }) => {
        if (parentVariant?.length && childVariant.variants?.length && parentVariant?.length == childVariant.variants?.length) {
          const match = parentVariant.map((c: { variant: { id: any; }; id: any; }) => childVariant.variants.find((s: { variant: { id: any; }; id: any; }) => (s.variant.id == c.variant.id && s.id == c.id))).filter((parentVarient: undefined) => parentVarient != undefined);
          if (match.length == parentVariant.length) {
            count++;
          }
        } else if (!parentVariant.length && !childVariant.variants?.length) {
          count++;
        }
      })
      if (count > 1) {
        notFound = false;
      }
    })
    return notFound;
  }

  onSubmit() {
    if (this.productFormService.formGroup.invalid) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "Please Fill Form Correctly" });
      return;
    } else {
      if (!this.validChields) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "Please Remove duplicate variant from your chields." });
        return;
      }
      const data = this.productFormService.value?.seoKeywords ? { ...this.productFormService.value, ...{ seoKeywords: this.productFormService.value?.seoKeywords.split(',') } } : this.productFormService.value;
      this.productApiService.createParentProduct(data).subscribe((res: { success: any; message: any; }) => {
        if (res.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
          this.clearInputForm()
          this.router.navigate(['/product/all-product']);
        } else {
          return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
        }
      }, (err: { error: { message: any[]; }; }) => {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message });
      })
    }
  }

  //For Edit
  getProductById() {
    this.productApiService.getParentProductById(this.id()).subscribe((res: { success: any; result: { products: any; }; message: any; }) => {
      if (res.success) {
        this.chields = [...res.result.products];
        delete res.result.products;
       
      } else {
        return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
      }
    }, (err: { error: { message: any[]; }; }) => {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message });
    })
  }
}
