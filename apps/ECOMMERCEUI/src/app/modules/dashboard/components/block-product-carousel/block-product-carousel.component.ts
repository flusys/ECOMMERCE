import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  Renderer2,
  signal,
  ViewChild,
} from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { SwiperContainer } from 'swiper/element';
import { ProductHorizontalMiniCardComponent } from '../../../../shared/components/product-horizontal-mini-card/product-horizontal-mini-card.component';
import { isPlatformBrowser } from '@angular/common';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-block-product-carousel',
  standalone: true,
  imports: [ProductVerticalCardComponent, ProductHorizontalMiniCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './block-product-carousel.component.html',
  styleUrl: './block-product-carousel.component.scss',
})
export class BlockProductCarouselComponent {
  type = input.required();
  platformId = inject(PLATFORM_ID);
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  slidesPerView = 4;
  spaceBetween = 10;

  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);


  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
    let tagId = 0;
    if (this.type() == 'featured') {
      tagId = 1;
    } else {
      tagId = 3;
    }
    this.productApiService.getAll('', { filter: { tagsId: tagId } }).subscribe(res => {
      this.products.set(res.result);
    })
  }

  updateSwiperSettings() {
    const width = window.innerWidth;
    if (width < 473) {
      this.slidesPerView = 1;
    } else if (width < 768) {
      this.slidesPerView = this.type() == 'new' ? 1 : 2;
    } else if (width < 992) {
      this.slidesPerView = this.type() == 'new' ? 2 : 3;
    } else {
      this.slidesPerView = this.type() == 'new' ? 3 : 4;
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
