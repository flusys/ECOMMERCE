import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { IFolderForm } from '../interfaces/folder-form.interface';

@Injectable({
  providedIn: 'root'
})
export class FolderFormService extends FormCommonClass<IFolderForm> {
  protected override messageService: MessageService;

  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<IFolderForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      serial: new FormControl(1, { nonNullable: true }),
    });
  }

}
