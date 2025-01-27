import { Component, inject, signal } from '@angular/core';
import { ProductApiService } from '../../../dashboard/services/product-api.service';

@Component({
  selector: 'app-latest-products',
  standalone: true,
  imports: [],
  templateUrl: './latest-products.component.html',
  styleUrl: './latest-products.component.scss'
})
export class LatestProductsComponent {
  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);
  ngOnInit() {
    this.productApiService.getAll('', { filter: { tagsId: 6 } }).subscribe(res => {
      this.products.set(res.result);
    })
  }

  getVariantName(product:any) {
    if (product?.variants && product?.variants.length) {
      return product?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }
}
