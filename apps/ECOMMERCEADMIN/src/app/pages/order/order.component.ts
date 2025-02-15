import { Component } from '@angular/core';
import { OrderListComponent } from '../../modules/order/components/order-list/order-list.component';
import { OrderCreateComponent } from '../../modules/order/components/order-create/order-create.component';
@Component({
  selector: 'app-order',
  imports: [
    OrderListComponent,
    OrderCreateComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent { }
