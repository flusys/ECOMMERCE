import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IUserForm } from '../interfaces/user-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UserFormService extends FormCommonClass<IUserForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IUserForm>({
      id: new FormControl(0, { nonNullable: true }),
      firstname: new FormControl('', { nonNullable: true }),
      lastname: new FormControl('', { nonNullable: true }),
      address: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true }),
      phone: new FormControl('', { nonNullable: true }),
      hasAccess: new FormControl(false, { nonNullable: true }),
    });
  }
}