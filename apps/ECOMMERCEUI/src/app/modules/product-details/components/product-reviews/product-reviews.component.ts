import { Component } from '@angular/core';
import { ProductRatingBarComponent } from '../../../../shared/components/product-rating-bar/product-rating-bar.component';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [ProductRatingBarComponent],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss',
})
export class ProductReviewsComponent {}
