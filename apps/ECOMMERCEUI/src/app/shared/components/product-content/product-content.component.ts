import {
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
import { WishlistStateService } from '../../../modules/wishlist/services/wishlist-state.service';
import { CartStateService } from '../../../modules/cart/services/cart-state.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

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

  router = inject(Router);
  messageService = inject(MessageService);
  wishlistStateService = inject(WishlistStateService);
  cartStateService = inject(CartStateService);
  quantity = signal(1);


  constructor() {
    effect(() => {
      const model = this.productDetails();
      if (model?.products?.length) {
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
    return this.selectedProduct()?.variants.find((item) => item.id == id);
  }

  changeVariationSelection(id: any, variant: string) {
    if (!this.isChacked(id)) {
      const productLists = this.productDetails()?.products;
      const currentVariantIds = this.selectedProduct()?.variants.map((item) =>
        item.attribute.name === variant ? id : item.id
      );
      const selectedProduct = productLists.find((product: any) => {
        if (product.variants.length !== currentVariantIds?.length) {
          return false;
        }
        return product.variants.every((item: any) => currentVariantIds?.includes(item.id));
      });

      if (selectedProduct) {
        this.selectedProduct.set(selectedProduct);
      }
    }
  }


  get isAlreadyAddToWishlist(): boolean {
    if (this.selectedProduct() != null) {
      const productId = this.selectedProduct()?._id;
      return productId ? this.wishlistStateService.isExitsOnWishList(productId) : false;
    }
    return false;
  }


  addToWishList() {
    if (this.selectedProduct() != null) {
      const productId = this.selectedProduct()?._id;
      if (productId) {
        if (!this.isAlreadyAddToWishlist)
          this.wishlistStateService.setWishhListProduct(productId);
        else
          this.wishlistStateService.removeWishhListProduct(productId);
      }
    }
  }


  get isAlreadyExitsOnCartList(): boolean {
    if (this.selectedProduct() != null) {
      const productId = this.selectedProduct()?._id;
      return productId ? this.cartStateService.isExitsOnCartList(productId) : false;
    }
    return false;
  }

  addToCartList() {
    if (this.quantity() <= 0) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Error!',
        detail: 'Quantity Must Be Getter than 0.',
      });
    }
    if (this.selectedProduct() != null) {
      const productId = this.selectedProduct()?._id;
      if (productId) {
        if (!this.isAlreadyExitsOnCartList)
          this.cartStateService.setCartListProduct(productId, this.quantity());
        else
          this.cartStateService.removeCartListProduct(productId);
      }
    }
  }

  goToCartList() {
    this.router.navigate(['/cart'])
  }

  changeQuantity(type:number){
    if(type==1){
      this.quantity.update((previous)=>{
        return ++previous;
      })
    }else{
      this.quantity.update((previous)=>{
        if(previous==1){
          this.messageService.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error!',
            detail: 'Quantity Must Be Getter than 0.',
          });
          return previous;
        }else{
          return --previous;
        }
      })
    }
  }
}
