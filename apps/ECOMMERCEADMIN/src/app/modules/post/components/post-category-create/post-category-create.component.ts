import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { PostCategoryApiService } from '../../services/post-category-api.service';
import { PostCategoryFormService } from '../../services/post-category-form.service';
import { PostCategoryStateService } from '../../services/post-category-state.service';
import { IPostCategory } from '../../interfaces/post-category-data.interface';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-post-category-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './post-category-create.component.html',
})
export class PostCategoryCreateComponent {
  postCategoryFormService = inject(PostCategoryFormService);
  postCategoryStateService = inject(PostCategoryStateService);
  postCategoryApiService = inject(PostCategoryApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IPostCategory | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.postCategoryStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.postCategoryFormService.patchValue({ ...model});
      } else {
        this.model = undefined;
      }
    });
  }

  onSubmit() {
    if (this.postCategoryFormService.formGroup.invalid) {
      this.postCategoryFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.postCategoryFormService.formGroup.getRawValue();

    (this.model ? this.postCategoryApiService.update(data) : this.postCategoryApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.postCategoryFormService.patchValue({ id: res.result });
        this.postCategoryStateService.addOrUpdateDataList(this.postCategoryFormService.value);
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
    this.postCategoryFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.postCategoryStateService.setState({ editModelData: null });
  }
}
