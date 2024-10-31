import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
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
  slidesPerView = 4;
  spaceBetween = 20;

  constructor() { }
  ngOnInit() {
    this.updateSwiperSettings();
    window.addEventListener('resize', this.updateSwiperSettings.bind(this));
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
