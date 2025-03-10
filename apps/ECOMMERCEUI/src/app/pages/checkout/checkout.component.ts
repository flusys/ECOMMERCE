import { Component, inject, OnInit, signal } from '@angular/core';
import { CartStateService } from '../../modules/cart/services/cart-state.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductApiService } from '../../modules/dashboard/services/product-api.service';
import { IProduct } from '../../modules/product-details/interfaces/product-data.interface';
import { AngularModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { OrderApiService } from '../../modules/checkout/services/order-api.service';
import { AuthApiService } from '../../modules/auth/services/auth-api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartStateService = inject(CartStateService);
  orderApiService = inject(OrderApiService);
  productApiService = inject(ProductApiService);
  private messageService = inject(MessageService);
  private authApiService = inject(AuthApiService);
  fb = inject(FormBuilder);
  products = signal<any[]>([]);
  shippingAmount = signal(50);
  readTermsAndCondition = signal(false);
  userdata = signal<any>({});
  billingForm!: FormGroup;
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

    this.billingForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: [''],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      createAccount: [false],
      differentAddress: [false],
      comment: [''],
      shipmentPrice: [this.shippingAmount()],
      total: [0],
    });

    this.authApiService.myProfileInformation().subscribe((data) => {
      this.userdata.set(data.data);
      this.billingForm.patchValue(data.data);
    });
  }

  get total() {
    return this.getSubTotal + this.shippingAmount();
  }

  getVariantName(data: IProduct) {
    if (data.variants && data.variants.length) {
      return data?.variants?.reduce((prev, cur) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }


  get getSubTotal() {
    return this.products()?.reduce((prev, cur) => {
      return prev += (cur.cartQuantity * cur.price)
    }, 0)
  }


  placeOrder() {
    if (!this.readTermsAndCondition()) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Agree terms and condition.',
      });
    }
    if (this.billingForm.invalid) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Something wrong in form validation.',
      });
    }
    let formData = this.billingForm.value;

    if (formData.createAccount && !formData.email) {
      return this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: 'Password is required.',
      });
    }

    formData = {
      ...formData, ...{
        products: this.products().map((product) => {
          return {
            product: product.id,
            quantity: product.cartQuantity,
            price: product.price,
            total: (product.cartQuantity * product.price)
          }
        }),
        total: this.total
      }
    }
    this.orderApiService.insert(formData).subscribe((res) => {
      this.products.set([]);
      this.cartStateService.removeAllCartProduct();
      this.billingForm.reset();
      this.billingForm.patchValue({
        shipmentPrice: this.shippingAmount(),
        ...this.userdata()
      });
      this.messageService.add({
        key: 'tst',
        severity: 'success',
        summary: 'Succes!',
        detail: 'Order Successfully Created.',
      });
    })

  }

}
