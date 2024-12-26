import { Component } from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { ProductHorizontalCardComponent } from '../../../../shared/components/product-horizontal-card/product-horizontal-card.component';

@Component({
  selector: 'app-block-best-sellers-products',
  standalone: true,
  imports: [
    ProductVerticalCardComponent,
    ProductHorizontalCardComponent
  ],
  templateUrl: './block-best-sellers-products.component.html',
  styleUrl: './block-best-sellers-products.component.scss'
})
export class BlockBestSellersProductsComponent {

}
