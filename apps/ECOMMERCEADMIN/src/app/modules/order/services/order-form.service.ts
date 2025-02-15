import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IOrderForm } from '../interfaces/order-form.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderFormService extends FormCommonClass<IOrderForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IOrderForm>({
      id: new FormControl(0, { nonNullable: true }),
      firstName: new FormControl('', { nonNullable: true }),
      lastName:  new FormControl('', { nonNullable: true }),
      address: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      phone: new FormControl('', { nonNullable: true }),
    });
  }

}
