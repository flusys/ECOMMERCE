import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductRatingBarComponent } from '../../shared/components/product-rating-bar/product-rating-bar.component';
import { ProductApiService } from '../../modules/dashboard/services/product-api.service';
import { WishlistStateService } from '../../modules/wishlist/services/wishlist-state.service';
import { AngularModule } from 'flusysng/shared/modules';
import { CartStateService } from '../../modules/cart/services/cart-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [
    ProductRatingBarComponent,
    AngularModule
  ],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit {
  productApiService = inject(ProductApiService);
  wishlistStateService = inject(WishlistStateService);
  cartStateService = inject(CartStateService);
  router = inject(Router);
  products = signal<any[]>([]);

  ngOnInit(): void {
    const wishList = this.wishlistStateService.getWishhListProduct();
    if (wishList.length) {
      const filter = { ids: wishList };
      this.productApiService.getAll('', { filter }).subscribe(res => {
        this.products.set(res.result);
      });
    }
  }

  getVariantName(product: any) {
    if (product?.variants && product?.variants.length) {
      return product?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }

  removeWishList(productId: string) {
    this.products.update((products) => {
      return products.filter((item) => item._id != productId);
    })
    this.wishlistStateService.removeWishhListProduct(productId);
  }

  isAlreadyExitsOnCartList(productId: string): boolean {
    return this.cartStateService.isExitsOnCartList(productId)
  }

  addToCartList(productId: string) {
    if (!this.isAlreadyExitsOnCartList(productId))
      this.cartStateService.setCartListProduct(productId, 1);
    else
      this.cartStateService.removeCartListProduct(productId);
  }

  goToCartList() {
    this.router.navigate(['/cart'])
  }
}
