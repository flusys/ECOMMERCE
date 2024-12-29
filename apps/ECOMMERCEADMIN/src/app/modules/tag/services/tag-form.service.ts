import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { ITagForm } from '../interfaces/tag-form.interface';

@Injectable({
  providedIn: 'root'
})
export class TagFormService extends FormCommonClass<ITagForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<ITagForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      priority: new FormControl(1, { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
    });
  }

}