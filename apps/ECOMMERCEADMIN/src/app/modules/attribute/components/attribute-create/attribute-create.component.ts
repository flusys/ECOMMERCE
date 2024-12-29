import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IAttribute } from '../../interfaces/attribute-data.interface';
import { AttributeApiService } from '../../services/attribute-api.service';
import { AttributeFormService } from '../../services/attribute-form.service';
import { AttributeStateService } from '../../services/attribute-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-attribute-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './attribute-create.component.html',
  styleUrl: './attribute-create.component.scss',
})
export class AttributeCreateComponent {
  attributeFormService = inject(AttributeFormService);
  attributeStateService = inject(AttributeStateService);
  attributeApiService = inject(AttributeApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IAttribute | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.attributeStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.attributeFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.attributeFormService.formGroup.invalid) {
      this.attributeFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.attributeFormService.formGroup.value;

    (this.model ? this.attributeApiService.update(data) : this.attributeApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.attributeFormService.patchValue({ id: res.result });
        this.attributeStateService.addOrUpdateDataList(this.attributeFormService.value);
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
    this.attributeFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.attributeStateService.setState({ editModelData: null });
  }
}
