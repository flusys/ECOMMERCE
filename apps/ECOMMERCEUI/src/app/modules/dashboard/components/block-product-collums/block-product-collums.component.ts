import { Component } from '@angular/core';
import { ProductHorizontalMiniCardComponent } from '../../../../shared/components/product-horizontal-mini-card/product-horizontal-mini-card.component';

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

}
