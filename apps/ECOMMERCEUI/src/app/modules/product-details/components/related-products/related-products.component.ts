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
import { SwiperContainer } from 'swiper/element';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { ProductApiService } from '../../../dashboard/services/product-api.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [ProductVerticalCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
})
export class RelatedProductsComponent {
  productDetails = input<any>();
  @ViewChild('swiper') swiperRef!: ElementRef<SwiperContainer>;
  platformId: Object = inject(PLATFORM_ID);
  slidesPerView = 5;
  spaceBetween = 10;

  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);

  getVariantName(product: any) {
    if (product?.variants && product?.variants.length) {
      return product?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const filter: any = {};
      if (this.productDetails().tags?.length > 0) {
        filter.tagsId = { $in: this.productDetails().tags.map((item: any) => item.id) };
      }
      if (this.productDetails()?.brand) {
        filter.brandId = this.productDetails()?.brand.id;
      }

      this.productApiService.getAll('', { filter: { tagsId: 6 } }).subscribe(res => {
        this.products.set(res.result);
      })
      this.updateSwiperSettings();
      window.addEventListener('resize', this.updateSwiperSettings.bind(this));
    }
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
