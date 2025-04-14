import { Component, inject, signal } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';
import { CartStateService } from '../../modules/cart/services/cart-state.service';
import { ProductApiService } from '../../modules/dashboard/services/product-api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartStateService = inject(CartStateService);
  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);
  messageService = inject(MessageService);

  ngOnInit(): void {
    const cartList = this.cartStateService.getCartListProduct();
    if (cartList.length) {
      const filter = { ids: cartList.map((item: any) => item.productId) };
      this.productApiService.getAll('', { filter }).subscribe(res => {
        const products = res.result.map((item) => {
          return { ...item, ...{ cartQuantity: cartList.find((cart: any) => cart.productId == item._id)?.quantity } }
        })
        this.products.set(products);
      });
    }
  }

  remoteCart(productId: string) {
    this.products.update((products) => {
      return products.filter((item) => item._id != productId);
    })
    this.cartStateService.removeCartListProduct(productId);
  }

  get getSubTotal() {
    return this.products()?.reduce((prev, cur) => {
      return prev += (cur.cartQuantity * cur.price)
    }, 0)
  }

  changeQuantity(product: any, type: number) {
    if (type == 1) {
      ++product.cartQuantity;
    } else {
      if (product.cartQuantity == 1) {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: 'Error!',
          detail: 'Quantity Must Be Getter than 0.',
        });
      } else {
        --product.cartQuantity;
      }
    }
  }
}
