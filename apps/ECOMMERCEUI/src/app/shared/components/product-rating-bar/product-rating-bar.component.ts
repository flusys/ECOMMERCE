import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-rating-bar',
  standalone: true,
  imports: [],
  templateUrl: './product-rating-bar.component.html',
  styleUrl: './product-rating-bar.component.scss',
})
export class ProductRatingBarComponent implements OnInit {
  star = input.required<number>();
  fillArray: number[] = [];
  nonFillArray: number[] = [];

  ngOnInit() {
    const count = 5-this.star(); // Change this number as needed
    this.nonFillArray = Array.from({ length: count }, (_, i) => i);
    this.fillArray = Array.from({ length: this.star() }, (_, i) => i);
  }


}
