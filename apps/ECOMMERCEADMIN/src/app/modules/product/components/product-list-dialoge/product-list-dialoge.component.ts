import { Component, inject } from '@angular/core';
import { ProductStateService } from '../../services/product-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { LayoutService } from 'flusysng/layout/services';
import { ProductApiService } from '../../services/product-api.service';
import { IProduct } from '../../interfaces/product-data.interface';
import { Router } from '@angular/router';
import { IAttribute } from '../../../attribute/interfaces/attribute-data.interface';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list-dialoge',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './product-list-dialoge.component.html',
})
export class ProductListDialogeComponent {
  productStateService = inject(ProductStateService);
  productApiService = inject(ProductApiService);
  messageService = inject(MessageService);
  router = inject(Router);
  layoutService = inject(LayoutService);
  dialogRef = inject(DynamicDialogRef);

  constructor() {
  }

  selectedProduct: IProduct[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  getInputString(event: any) {
    return event.target.value;
  }

  getVariantName(data: IProduct) {
    if (data.variants && data.variants.length) {
      return data?.variants?.reduce((prev, cur) => {
        return prev + (cur?.attribute as IAttribute)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }

  closeDialog(type: string) {
    if (type == 'close') {
      this.dialogRef.close([]);
    } else {
      if (this.selectedProduct.length) {
        this.dialogRef.close(this.selectedProduct);
      } else {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "You Need to Select Product" });
      }
    }
  }


}
