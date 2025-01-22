import { Component } from '@angular/core';
import { ProductListComponent } from '../../modules/product/components/product-list/product-list.component';

@Component({
  selector: 'app-product-list{root}',
  imports: [
    ProductListComponent
  ],
  templateUrl: './product-list.component.html',
})
export class ProductListComponentPage {}
