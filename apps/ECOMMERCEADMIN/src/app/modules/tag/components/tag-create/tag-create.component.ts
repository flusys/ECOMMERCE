import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ITag } from '../../interfaces/tag-data.interface';
import { TagApiService } from '../../services/tag-api.service';
import { TagFormService } from '../../services/tag-form.service';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'app-tag-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './tag-create.component.html',
  styleUrl: './tag-create.component.scss',
})
export class TagCreateComponent {
  tagFormService = inject(TagFormService);
  tagStateService = inject(TagStateService);
  tagApiService = inject(TagApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: ITag | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.tagStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.tagFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.tagFormService.formGroup.invalid) {
      this.tagFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.tagFormService.formGroup.value;

    (this.model ? this.tagApiService.update(data) : this.tagApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.tagFormService.patchValue({ id: res.result });
        this.tagStateService.addOrUpdateDataList(this.tagFormService.value);
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
    this.tagFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.tagStateService.setState({ editModelData: null });
  }
}
