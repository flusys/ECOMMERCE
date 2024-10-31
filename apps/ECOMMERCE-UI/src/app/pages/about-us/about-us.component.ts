import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';
import { AngularModule } from '../../shared/modules/angular.module';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    AngularModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  slidesPerView = 3;
  spaceBetween = 10;

  constructor() { }

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
    } else {
      this.slidesPerView = 3;
    }
  }
}
