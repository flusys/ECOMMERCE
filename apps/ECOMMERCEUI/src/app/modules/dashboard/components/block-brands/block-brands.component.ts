import { isPlatformBrowser } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-block-brands',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-brands.component.html',
  styleUrl: './block-brands.component.scss'
})
export class BlockBrandsComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId = inject(PLATFORM_ID);
  slidesPerView = 4;
  spaceBetween = 20;

  constructor() { }
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
  }

  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 576) {
      this.slidesPerView = 2;
    } else if (width < 768) {
      this.slidesPerView = 3;
    } else if (width < 992) {
      this.slidesPerView = 4;
    } else if (width < 1200) {
      this.slidesPerView = 5;
    } else {
      this.slidesPerView = 6;
    }
  }
}
