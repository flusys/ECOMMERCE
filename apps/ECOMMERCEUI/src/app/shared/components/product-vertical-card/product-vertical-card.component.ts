import { Component, input, InputSignal } from '@angular/core';
import { ProductRatingBarComponent } from '../product-rating-bar/product-rating-bar.component';
import { AngularModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-product-vertical-card',
  standalone: true,
  imports: [
    AngularModule,
    ProductRatingBarComponent
  ],
  templateUrl: './product-vertical-card.component.html',
  styleUrl: './product-vertical-card.component.scss',
})
export class ProductVerticalCardComponent {
  showFeatures = input.required<boolean>();
  product: InputSignal<any> = input<any>({
    parentProduct: '',
    image: '',
    ingredients:[],
    price:0
  });

  quickViewShow() {
    const quickView = document.getElementById('product-quick-view');
    quickView?.style.setProperty('display', 'flex');
  }

  getVariantName() {
    if (this.product()?.variants && this.product()?.variants.length) {
      return this.product()?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }


}
