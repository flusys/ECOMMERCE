import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IAttributeValueForm } from '../interfaces/attribute-value-form.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeValueFormService extends FormCommonClass<IAttributeValueForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IAttributeValueForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      attribute: new FormControl(0, { nonNullable: true }),
    });
  }

}