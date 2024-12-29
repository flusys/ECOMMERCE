import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { AttributeValueApiService } from '../../services/attribute-value-api.service';
import { AttributeValueFormService } from '../../services/attribute-value-form.service';
import { AttributeValueStateService } from '../../services/attribute-value-state.service';
import { IAttributeValue } from '../../interfaces/attribute-value-data.interface';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { AttributeStateService } from '../../services/attribute-state.service';
import { IAttribute } from '../../interfaces/attribute-data.interface';

@Component({
  selector: 'app-attribute-value-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './attribute-value-create.component.html',
  styleUrl: './attribute-value-create.component.scss',
})
export class AttributeValueCreateComponent {
  attributeValueFormService = inject(AttributeValueFormService);
  attributeValueStateService = inject(AttributeValueStateService);
  attributeValueApiService = inject(AttributeValueApiService);
  private messageService = inject(MessageService);
  attributeStateService = inject(AttributeStateService);

  isPanelCollapsed = true;
  model: IAttributeValue | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.attributeValueStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.attributeValueFormService.patchValue({ ...model, ...{ attribute: (model.attribute as IAttribute).id } });
      } else {
        this.model = undefined;
      }
    });
  }

  get attributeList() {
    return this.attributeStateService.select('data')().result;
  }

  onSubmit() {
    if (this.attributeValueFormService.formGroup.invalid) {
      this.attributeValueFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.attributeValueFormService.formGroup.getRawValue();

    console.warn(this.attributeList);

    (this.model ? this.attributeValueApiService.update(data) : this.attributeValueApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.attributeValueFormService.patchValue({ id: res.result });
        this.attributeValueStateService.addOrUpdateDataList(this.attributeValueFormService.value);
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
    this.attributeValueFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.attributeValueStateService.setState({ editModelData: null });
  }
}
