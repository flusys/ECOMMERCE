import { Component } from '@angular/core';
import { OrderListComponent } from '../../modules/order/components/order-list/order-list.component';
@Component({
  selector: 'app-order',
  imports: [
    OrderListComponent
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent { }
