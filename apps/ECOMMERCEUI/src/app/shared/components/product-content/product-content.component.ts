import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ProductRatingBarComponent } from '../product-rating-bar/product-rating-bar.component';
import { SwiperContainer } from 'swiper/element';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-content',
  standalone: true,
  imports: [
    CommonModule,
    ProductRatingBarComponent
  ],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductContentComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId = inject(PLATFORM_ID);
  slidesPerView = 4;
  spaceBetween = 10;
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
  }
  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 380) {
      this.slidesPerView = 3;
    } else if (width < 473) {
      this.slidesPerView = 4;
    } else if (width < 768) {
      this.slidesPerView = 5;
    } else {
      this.slidesPerView = 4;
    }
  }
  activeIndex = 0;
  productImageList = [
    'images/products/product-16.jpg',
    'images/products/product-16-1.jpg',
    'images/products/product-16-2.jpg',
    'images/products/product-16-3.jpg',
    'images/products/product-16-4.jpg',
  ]
  get activeImage() {
    return this.productImageList[this.activeIndex]
  }
}
