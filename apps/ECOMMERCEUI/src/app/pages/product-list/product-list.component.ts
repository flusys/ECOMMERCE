import { Component } from '@angular/core';
import { ProductFilterComponent } from '../../modules/product-list/components/product-filter/product-filter.component';
import { LatestProductsComponent } from '../../modules/product-list/components/latest-products/latest-products.component';
import { ProductListViewComponent } from '../../modules/product-list/components/product-list-view/product-list-view.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    ProductFilterComponent,
    LatestProductsComponent,
    ProductListViewComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {

}
