import { Component, inject, input, InputSignal } from '@angular/core';
import { ProductRatingBarComponent } from '../product-rating-bar/product-rating-bar.component';
import { AngularModule } from 'flusysng/shared/modules';
import { Router } from '@angular/router';
import { WishlistStateService } from '../../../modules/wishlist/services/wishlist-state.service';
import { CartStateService } from '../../../modules/cart/services/cart-state.service';
import { ProductApiService } from '../../../modules/dashboard/services/product-api.service';
import { GlobalStateService } from '../../services/global-state.service';

@Component({
  selector: 'app-product-vertical-card',
  standalone: true,
  imports: [
    AngularModule,
    ProductRatingBarComponent
  ],
  templateUrl: './product-vertical-card.component.html',
  styleUrl: './product-vertical-card.component.scss',
})
export class ProductVerticalCardComponent {
  showFeatures = input.required<boolean>();
  router = inject(Router);
  wishlistStateService = inject(WishlistStateService);
  productApiService = inject(ProductApiService);
  cartStateService = inject(CartStateService);
  globalStateService = inject(GlobalStateService);
  product: InputSignal<any> = input<any>({
    parentProduct: '',
    image: '',
    ingredients: [],
    price: 0
  });

  quickViewShow() {
    if (this.product().parentProduct._id) {
      this.productApiService.getParentProductById(this.product().parentProduct._id).subscribe(res => {
        this.globalStateService.selectedQuickViewProduct.set(res.result);
      })
    } else {
      console.error('Product ID is null');
    }
  }

  getVariantName() {
    if (this.product()?.variants && this.product()?.variants.length) {
      return this.product()?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }


  nevigateDetailPage() {
    this.router.navigate(['/product-details/' + this.product().parentProduct._id])
  }

  get isAlreadyAddToWishlist(): boolean {
    return this.wishlistStateService.isExitsOnWishList(this.product()._id)
  }
  addToWishList() {
    if (!this.isAlreadyAddToWishlist)
      this.wishlistStateService.setWishhListProduct(this.product()._id);
    else
      this.wishlistStateService.removeWishhListProduct(this.product()._id);
  }


  get isAlreadyExitsOnCartList(): boolean {
    return this.cartStateService.isExitsOnCartList(this.product()._id)
  }

  addToCartList() {
    if (!this.isAlreadyExitsOnCartList)
      this.cartStateService.setCartListProduct(this.product()._id, 1);
    else
      this.cartStateService.removeCartListProduct(this.product()._id);
  }

  goToCartList() {
    this.router.navigate(['/cart'])
  }
}
