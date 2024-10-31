import { Component, input } from '@angular/core';
import { ProductRatingBarComponent } from '../product-rating-bar/product-rating-bar.component';

@Component({
  selector: 'app-product-vertical-card',
  standalone: true,
  imports: [ProductRatingBarComponent],
  templateUrl: './product-vertical-card.component.html',
  styleUrl: './product-vertical-card.component.scss',
})
export class ProductVerticalCardComponent {
  showFeatures = input.required<boolean>();

  quickViewShow() {
    const quickView = document.getElementById('product-quick-view');
    quickView?.style.setProperty('display', 'block');
  }
}
