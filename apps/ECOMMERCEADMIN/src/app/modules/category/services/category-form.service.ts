import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { ICategoryForm } from '../interfaces/category-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryFormService extends FormCommonClass<ICategoryForm> {
  protected override messageService: MessageService;

  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<ICategoryForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
      parent: new FormControl(0, { nonNullable: true }),
    });
  }

}