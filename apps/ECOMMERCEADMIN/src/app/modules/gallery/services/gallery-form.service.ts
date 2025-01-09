import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IGalleryForm } from '../interfaces/gallery-form.interface';

@Injectable({
  providedIn: 'root'
})
export class GalleryFormService extends FormCommonClass<IGalleryForm> {
  protected override messageService: MessageService;

  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IGalleryForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      url: new FormControl('', { nonNullable: true }),
      folder: new FormControl(0, { nonNullable: true }),
      size: new FormControl('', { nonNullable: true }),
      type: new FormControl('', { nonNullable: true }),
    });
  }

}
