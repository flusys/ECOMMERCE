import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IBannerForm } from '../interfaces/banner-form.interface';

@Injectable({
  providedIn: 'root'
})
export class BannerFormService extends FormCommonClass<IBannerForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IBannerForm>({
      id: new FormControl(0, { nonNullable: true }),
      type: new FormControl('', { nonNullable: true }),
      url: new FormControl('', { nonNullable: true }),
      title: new FormControl('', { nonNullable: true }),
      subTitle: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
      mblImage: new FormControl('', { nonNullable: true }),
      serial: new FormControl(0, { nonNullable: true }),
    });
  }

}