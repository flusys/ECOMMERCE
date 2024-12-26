import { Component } from '@angular/core';
import { ProductRatingBarComponent } from '../../shared/components/product-rating-bar/product-rating-bar.component';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    ProductRatingBarComponent
  ],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent {

}
