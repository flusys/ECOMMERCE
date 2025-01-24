import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IPostForm } from '../interfaces/post-form.interface';

@Injectable({
  providedIn: 'root'
})
export class PostFormService extends FormCommonClass<IPostForm> {
  protected override messageService: MessageService;

  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IPostForm>({
      id: new FormControl(0, { nonNullable: true }),
      title: new FormControl('', { nonNullable: true }),
      isHtml: new FormControl(false, { nonNullable: true }),
      description: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
      category: new FormControl(0, { nonNullable: true }),
    });
  }

}