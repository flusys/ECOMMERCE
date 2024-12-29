import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICompany } from '../../interfaces/company-data.interface';
import { CompanyApiService } from '../../services/company-api.service';
import { CompanyFormService } from '../../services/company-form.service';
import { CompanyStateService } from '../../services/company-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-company-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.scss',
})
export class CompanyCreateComponent {
  companyFormService = inject(CompanyFormService);
    companyStateService = inject(CompanyStateService);
    companyApiService = inject(CompanyApiService);
    private messageService = inject(MessageService);
  
    isPanelCollapsed = true;
    model: ICompany | undefined;
  
    readonly inputForm = viewChild.required<NgForm>('inputForm');
    readonly formControls = viewChildren(FormControlName, { read: ElementRef });
  
    constructor() {
      effect(() => {
        const model = this.companyStateService.select('editModelData')() ?? undefined;
        if (model) {
          this.model = model;
          this.isPanelCollapsed = false;
          this.companyFormService.patchValue({ ...model });
        } else {
          this.model = undefined;
        }
      });
    }
  
  
    onSubmit() {
      if (this.companyFormService.formGroup.invalid) {
        this.companyFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
        return;
      }
      let data = this.companyFormService.formGroup.value;
  
      (this.model ? this.companyApiService.update(data) : this.companyApiService.insert(data)).pipe(take(1)).subscribe((res) => {
        if (res.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
          this.companyFormService.patchValue({ id: res.result });
          this.companyStateService.addOrUpdateDataList(this.companyFormService.value);
          this.clearInputForm()
        } else {
          return this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
        }
      }, (err) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Sorry!',
          detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
        });
      })
    }
  
  
    clearInputForm() {
      this.companyFormService.reset();
      this.inputForm().reset();
      this.model = undefined;
      this.companyStateService.setState({ editModelData: null });
    }
}
