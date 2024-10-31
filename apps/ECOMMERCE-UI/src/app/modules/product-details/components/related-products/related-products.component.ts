import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [ProductVerticalCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
})
export class RelatedProductsComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  slidesPerView = 5;
  spaceBetween = 10;

  constructor() {}

  ngOnInit() {
    this.updateSwiperSettings();
    window.addEventListener('resize', this.updateSwiperSettings.bind(this));
  }

  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 473) {
      this.slidesPerView = 4;
    } else if (width < 768) {
      this.slidesPerView = 2;
    } else if (width < 992) {
      this.slidesPerView = 3;
    } else if (width < 1200) {
      this.slidesPerView = 4;
    } else {
      this.slidesPerView = 5;
    }
  }

  changeSlide(prevOrNext: number): void {
    if (prevOrNext === -1) {
      this.swiperRef.nativeElement.swiper.slidePrev();
    } else {
      this.swiperRef.nativeElement.swiper.slideNext();
    }
  }
}
