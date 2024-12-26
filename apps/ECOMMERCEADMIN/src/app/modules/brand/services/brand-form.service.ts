import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IBrandForm } from '../interfaces/brand-form.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandFormService extends FormCommonClass<IBrandForm> {
  protected override messageService: MessageService;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IBrandForm>({
      id: new FormControl(0, { nonNullable: true }),
      isActive: new FormControl(true, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
      serial: new FormControl(0, { nonNullable: true }),
    });
  }

}