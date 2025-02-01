import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
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
import { IProduct } from '../../../modules/product-details/interfaces/product-data.interface';

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
  varients: { [key: string]: any[] } = {};

  constructor() {
    effect(() => {
      const model = this.productDetails();
      if (model?.products?.length) {
        console.warn(model.products[0])
        this.selectedProduct.set(model.products[0]);
        const variantMap = new Map<string, Map<number, { id: number, name: string }>>();
        model.products.forEach((item: any) => {
          item?.variants.forEach((variant: any) => {
            const attributeName = variant.attribute.name;
            const attributeMap = variantMap.get(attributeName) || new Map<number, { id: number, name: string }>();

            if (!attributeMap.has(variant.id)) {
              attributeMap.set(variant.id, { id: variant.id, name: variant.name });
            }
            variantMap.set(attributeName, attributeMap);
          });
        });
        this.varients = {};
        variantMap.forEach((attributeMap, attributeName) => {
          this.varients[attributeName] = Array.from(attributeMap.values());
        });
      }
    });
  }

  selectedProduct = signal<IProduct | null>(null);

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
  get activeImage() {
    if (this.productDetails()?.images?.length)
      return this.productDetails()?.images[this.activeIndex];
    return ""
  }

  get varientsValue(): any[] {
    return Object.keys(this.varients);
  }

  isChacked(id: any): boolean {
    return this.selectedProduct()?.variants.find((item) => item.id = id);
  }

  changeVariationSelection(id: any) {
    console.warn(this.selectedProduct());
    console.warn(id)
    if (!this.isChacked(id)) {
      const productLists = this.productDetails()?.products;
      // this.selectedProduct()?.variants.find((item) => item.id = id);
    }
  }

}
