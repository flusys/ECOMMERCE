import { Component, inject, signal } from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { ProductHorizontalCardComponent } from '../../../../shared/components/product-horizontal-card/product-horizontal-card.component';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-block-best-sellers-products',
  standalone: true,
  imports: [
    ProductVerticalCardComponent,
    ProductHorizontalCardComponent
  ],
  templateUrl: './block-best-sellers-products.component.html',
  styleUrls: ['./block-best-sellers-products.component.scss']
})
export class BlockBestSellersProductsComponent {

  productApiService = inject(ProductApiService);
  mainProduct = signal<any>({});
  products = signal<any[]>([]);

  ngOnInit() {
    this.productApiService.getAll('', { pagination: { currentPage: 0, pageSize: 7 }, filter: { tagsId: 2 } }).subscribe(res => {
      this.mainProduct.set(res.result[0]);
      this.products.set(res.result.slice(1, 7));
    });
  }

}
