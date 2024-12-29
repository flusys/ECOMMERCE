import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormCommonClass } from 'flusysng/shared/classes';
import { MessageService } from 'primeng/api';
import { ICompanyForm } from '../interfaces/company-form.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyFormService extends FormCommonClass<ICompanyForm> {
  protected override messageService: MessageService;
  
  constructor() {
    const messageService = inject(MessageService);

    super(messageService)
    this.messageService = messageService;

    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup<ICompanyForm>({
      id: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      address: new FormControl('', { nonNullable: true }),
      image: new FormControl('', { nonNullable: true }),
    });
  }

}
