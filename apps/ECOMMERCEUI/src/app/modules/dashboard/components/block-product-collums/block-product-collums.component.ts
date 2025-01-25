import { Component, inject, signal } from '@angular/core';
import { ProductHorizontalMiniCardComponent } from '../../../../shared/components/product-horizontal-mini-card/product-horizontal-mini-card.component';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-block-product-collums',
  standalone: true,
  imports: [
    ProductHorizontalMiniCardComponent
  ],
  templateUrl: './block-product-collums.component.html',
  styleUrl: './block-product-collums.component.scss'
})
export class BlockProductCollumsComponent {

  productApiService = inject(ProductApiService);
  topRatedProducts = signal<any[]>([]);
  specialProducts = signal<any[]>([]);
  bestSallerProducts = signal<any[]>([]);

  ngOnInit() {
    this.productApiService.getAll('', { pagination: { currentPage: 0, pageSize: 3 }, filter: { tagsId: 4 } }).subscribe(res => {
      this.topRatedProducts.set(res.result);
    });

    this.productApiService.getAll('', { pagination: { currentPage: 0, pageSize: 3 }, filter: { tagsId: 5 } }).subscribe(res => {
      this.specialProducts.set(res.result);
    });

    this.productApiService.getAll('', { pagination: { currentPage: 0, pageSize: 3 }, filter: { tagsId: 2 } }).subscribe(res => {
      this.bestSallerProducts.set(res.result);
    });
  }
}
