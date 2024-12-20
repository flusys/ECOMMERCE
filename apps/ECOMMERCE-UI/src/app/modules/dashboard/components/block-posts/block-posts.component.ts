import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-block-posts',
  standalone: true,
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-posts.component.html',
  styleUrl: './block-posts.component.scss'
})
export class BlockPostsComponent {
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
    if (width < 992) {
      this.slidesPerView = 1;
    } else {
      this.slidesPerView = 2;
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
