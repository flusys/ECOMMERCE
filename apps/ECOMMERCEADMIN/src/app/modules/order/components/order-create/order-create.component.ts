import { Component, effect, ElementRef, inject, signal, viewChild, viewChildren, WritableSignal } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IOrderDetails } from '../../interfaces/order-data.interface';
import { OrderApiService } from '../../services/order-api.service';
import { OrderFormService } from '../../services/order-form.service';
import { OrderStateService } from '../../services/order-state.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductListDialogeComponent } from '../../../product/components/product-list-dialoge/product-list-dialoge.component';
import { IProduct } from '../../../product/interfaces/product-data.interface';
import { IAttribute } from '../../../attribute/interfaces/attribute-data.interface';

@Component({
  selector: 'app-order-create',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss',
  providers: [DialogService]
})
export class OrderCreateComponent {
  orderFormService = inject(OrderFormService);
  orderStateService = inject(OrderStateService);
  orderApiService = inject(OrderApiService);
  dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IOrderDetails | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  //Image Dialog
  ref: DynamicDialogRef | undefined;
  products: WritableSignal<IProduct[]> = signal([])

  constructor() {
    effect(() => {
      const model = this.orderStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.orderFormService.patchValue({ ...model });
        this.products.set(model.orderitems.map((item)=>{
          return {...item.product as IProduct,...{
            price:item.price,
            quantity:item.quantity,
            orderid:item.id
          } };
        }))
      } else {
        this.model = undefined;
      }
    });
  }

  openSelecProduct() {
    this.ref = this.dialogService.open(ProductListDialogeComponent, {
      data: null,
      header: 'Select a Image',
      width: '70%',
      showHeader: false,
    });

    this.ref.onClose.subscribe((products: IProduct[]) => {
      if (products && products.length) {
        this.products.set(products.map((item) => { return { ...item, ...{ quantity: 1 } } }))
      } else {
        this.products.set([])
      }
    });
  }

  getVariantName(data: IProduct) {
    if (data.variants && data.variants.length) {
      return data?.variants?.reduce((prev, cur) => {
        return prev + (cur?.attribute as IAttribute)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }


  onSubmit() {
    if (this.orderFormService.formGroup.invalid) {
      this.orderFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.orderFormService.formGroup.value;
    data = {
      ...data, ...{
        products: this.products().map((product) => {
          return {
            id: product?.orderid,
            product: product.id,
            quantity: product.quantity,
            price: product.price,
            total: (product.quantity * product.price)
          }
        }),
        total: this.products().reduce((prev, cur) => {
          return prev += (cur.quantity * cur.price)
        }, 0),
      },
    };
    (this.model ? this.orderApiService.update(data) : this.orderApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.orderFormService.patchValue({ id: res.result });
        this.orderStateService.addOrUpdateDataList(this.orderFormService.value);
        this.clearInputForm()
      } else {
        return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
      }
    }, (err) => {
      this.messageService.add({
        key: 'tst',
        severity: 'warn',
        summary: 'Sorry!',
        detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
      });
    })
  }


  clearInputForm() {
    this.orderFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.products.set([])
    this.orderStateService.setState({ editModelData: null });
  }
}
