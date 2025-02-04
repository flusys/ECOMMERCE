import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartStateService {
  private platformId: Object = inject(PLATFORM_ID);

  getCartListProduct() {
    if (isPlatformBrowser(this.platformId))
      return localStorage.getItem("cart_list_items")
    else
      return null
  }

  setCartListProduct(productId: string, quantity: number) {
    const previousItems = JSON.parse(this.getCartListProduct() ?? "[]");
    previousItems.push({ productId, quantity });
    localStorage.setItem("cart_list_items", JSON.stringify(previousItems));
  }

  removeCartListProduct(productId: string) {
    let previousItems: Array<{productId:string,quantity:number}> = JSON.parse(this.getCartListProduct() ?? "[]");
    previousItems = previousItems.filter((item) => item.productId != productId);
    localStorage.setItem("cart_list_items", JSON.stringify(previousItems));
  }

  isExitsOnCartList(productId: string): boolean {
    let previousItems: Array<{productId:string,quantity:number}> = JSON.parse(this.getCartListProduct() ?? "[]");
    return previousItems.find((item) => item.productId == productId) ? true : false;
  }
}
