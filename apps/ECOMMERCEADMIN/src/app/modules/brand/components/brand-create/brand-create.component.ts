import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IBrand } from '../../interfaces/brand-data.interface';
import { BrandApiService } from '../../services/brand-api.service';
import { BrandFormService } from '../../services/brand-form.service';
import { BrandStateService } from '../../services/brand-state.service';

@Component({
  selector: 'app-brand-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './brand-create.component.html',
  styleUrl: './brand-create.component.scss',
})
export class BrandCreateComponent {
  brandFormService = inject(BrandFormService);
  brandStateService = inject(BrandStateService);
  brandApiService = inject(BrandApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IBrand | undefined;


  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    effect(() => {
      const model = this.brandStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.brandFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.brandFormService.formGroup.invalid) {
      this.brandFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.brandFormService.formGroup.value;

    (this.model ? this.brandApiService.update(data) : this.brandApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.brandFormService.patchValue({ id: res.result });
        this.brandStateService.addOrUpdateDataList(this.brandFormService.value);
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
    this.brandFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.brandStateService.setState({ editModelData: null });
  }
}
