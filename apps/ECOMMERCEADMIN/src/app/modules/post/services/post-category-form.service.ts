import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IPostCategoryForm } from '../interfaces/post-category-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PostCategoryFormService extends FormCommonClass<IPostCategoryForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IPostCategoryForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
    });
  }

}