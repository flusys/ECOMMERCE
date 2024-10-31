import { Component } from '@angular/core';
import { ProductVerticalCardComponent } from '../product-vertical-card/product-vertical-card.component';

@Component({
  selector: 'app-product-horizontal-mini-card',
  standalone: true,
  imports: [
    ProductVerticalCardComponent
  ],
  templateUrl: './product-horizontal-mini-card.component.html',
  styleUrl: './product-horizontal-mini-card.component.scss'
})
export class ProductHorizontalMiniCardComponent {

}
