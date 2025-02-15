import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IOrderDetails } from '../../interfaces/order-data.interface';
import { OrderApiService } from '../../services/order-api.service';
import { OrderStateService } from '../../services/order-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { OrderStatus } from '../../enums/status.enum';

@Component({
  selector: 'app-order-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  orderStateService = inject(OrderStateService);
  orderApiService = inject(OrderApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedOrder: IOrderDetails[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedOrder = [];
    this.orderStateService.withDeleted = !this.orderStateService.withDeleted;
    if (!type) {
      if (this.orderStateService.withDeleted) {
        this.orderStateService.callApi();
      } else {
        this.orderStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editOrder(order: IOrderDetails) {
    this.orderStateService.setState({ editModelData: null });
    this.orderStateService.setState({ editModelData: order });
  }

  deleteOrRestore(type: string) {
    if (this.selectedOrder.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedOrder.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedOrder.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.orderApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.orderStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
          if (type == 'restore')
            this.withDeletedItem(1);
          this.clearAll()
        } else {
          this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: result.message });
        }
      }, (err) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Sorry!',
          detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
        });
      })
    } else {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: "Need to Select order first!"
      });
    }
  }


  clearAll() {
    this.selectedOrder = []
  }


  get orderStatusOptions(){
    return  Object.keys(OrderStatus).map(key => ({
      label: key,
      value: OrderStatus[key as keyof typeof OrderStatus]
    }));
  }
}
