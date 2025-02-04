import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistStateService {

  private platformId: Object = inject(PLATFORM_ID);

  getWishhListProduct() {
    if (isPlatformBrowser(this.platformId))
      return localStorage.getItem("wish_list_items")
    else
      return null
  }

  setWishhListProduct(productId: string) {
    const previousItems = JSON.parse(this.getWishhListProduct() ?? "[]");
    previousItems.push(productId);
    localStorage.setItem("wish_list_items", JSON.stringify(previousItems));
  }

  removeWishhListProduct(productId: string) {
    let previousItems: Array<string> = JSON.parse(this.getWishhListProduct() ?? "[]");
    previousItems = previousItems.filter((item) => item != productId);
    localStorage.setItem("wish_list_items", JSON.stringify(previousItems));
  }

  isExitsOnWishList(productId: string): boolean {
    let previousItems: Array<string> = JSON.parse(this.getWishhListProduct() ?? "[]");
    return previousItems.find((item) => item == productId) ? true : false;
  }

}
