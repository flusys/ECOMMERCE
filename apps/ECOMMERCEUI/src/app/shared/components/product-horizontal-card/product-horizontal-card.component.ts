import { Component, input } from '@angular/core';
import { ProductVerticalCardComponent } from '../product-vertical-card/product-vertical-card.component';

@Component({
  selector: 'app-product-horizontal-card',
  standalone: true,
  imports: [
    ProductVerticalCardComponent
  ],
  templateUrl: './product-horizontal-card.component.html',
  styleUrl: './product-horizontal-card.component.scss'
})
export class ProductHorizontalCardComponent {
  product = input<any>();
}
