import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListSharedComponent } from '../../shared/components/product-list/product-list.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListSharedComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  currentIndex = 0;
  items = [
    { image: 'favicon.ico', alt: 'Image 1' },
    { image: 'favicon.ico', alt: 'Image 2' },
    { image: 'favicon.ico', alt: 'Image 3' },
  ];

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
  }
}
