import { Component, inject } from '@angular/core';
import { ProductStateService } from '../../services/product-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { LayoutService } from 'flusysng/layout/services';
import { ProductApiService } from '../../../product/services/product-api.service';
import { IProduct } from '../../interfaces/product-data.interface';
import { Router } from '@angular/router';
import { IAttribute } from '../../../attribute/interfaces/attribute-data.interface';

@Component({
  selector: 'app-product-list',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  productStateService = inject(ProductStateService);
  productApiService = inject(ProductApiService);
  router = inject(Router);
  layoutService = inject(LayoutService);

  constructor() {
  }

  selectedProduct: IProduct[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedProduct = [];
    this.productStateService.withDeleted = !this.productStateService.withDeleted;
    if (!type) {
      if (this.productStateService.withDeleted) {
        this.productStateService.callApi();
      } else {
        // this.productStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editProduct(product: IProduct) {
    this.productStateService.setState({ editModelData: null });
    this.productStateService.setState({ editModelData: product });
    this.router.navigate(['/create-product']);
  }

  getVariantName(data: IProduct) {
    if (data.variants && data.variants.length) {
      return data?.variants?.reduce((prev, cur) => {
        return prev + (cur?.attribute as IAttribute)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }

  clearAll() {
    this.selectedProduct = []
  }

}
