import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ProductRatingBarComponent } from '../product-rating-bar/product-rating-bar.component';
import { SwiperContainer } from 'swiper/element';
import { isPlatformBrowser } from '@angular/common';
import { AngularModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-product-content',
  standalone: true,
  imports: [
    AngularModule,
    ProductRatingBarComponent
  ],
  templateUrl: './product-content.component.html',
  styleUrl: './product-content.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductContentComponent {
  productDetails = input<any>();
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId = inject(PLATFORM_ID);
  slidesPerView = 4;
  spaceBetween = 10;
  

  selectedProduct=signal({});

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
      this.selectedProduct.set(this.productDetails().products[0]);
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
  get activeImage() {
    if (this.productDetails()?.images?.length)
      return this.productDetails()?.images[this.activeIndex];
    return ""
  }




}
