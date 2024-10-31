import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-rating-bar',
  standalone: true,
  imports: [],
  templateUrl: './product-rating-bar.component.html',
  styleUrl: './product-rating-bar.component.scss',
})
export class ProductRatingBarComponent {
  star = input.required<number>();
}
