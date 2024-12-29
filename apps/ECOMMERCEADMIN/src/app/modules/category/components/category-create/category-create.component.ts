import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICategory } from '../../interfaces/category-data.interface';
import { CategoryApiService } from '../../services/category-api.service';
import { CategoryFormService } from '../../services/category-form.service';
import { CategoryStateService } from '../../services/category-state.service';
import { AppTreeCategoryComponent } from '../tree-category.component';

@Component({
  selector: 'app-category-create',
  imports: [
    AngularModule,
    PrimeModule,

    AppTreeCategoryComponent
  ],
  templateUrl: './category-create.component.html',
  styleUrl: './category-create.component.scss',
})
export class CategoryCreateComponent {
  categoryFormService = inject(CategoryFormService);
  categoryStateService = inject(CategoryStateService);
  categoryApiService = inject(CategoryApiService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: ICategory | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.categoryStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.categoryFormService.patchValue({ ...model, ...{ parent: (model.parent as ICategory)?.id??null } });
      } else {
        this.model = undefined;
      }
    });
  }

  get parentId(): number {
    return this.categoryFormService.value.parent ?? 0;
  }

  handleItemSelection(value: { item: ICategory, value: boolean }) {
    if (value.value) {
      this.categoryFormService.patchValue({
        parent: value.item.id
      })
    } else {
      this.categoryFormService.patchValue({
        parent: null
      })
    }
  }

  onSubmit() {
    if (this.categoryFormService.formGroup.invalid) {
      this.categoryFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.categoryFormService.formGroup.value;

    (this.model ? this.categoryApiService.update(data) : this.categoryApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.categoryFormService.patchValue({ id: res.result });
        this.categoryStateService.addOrUpdateDataList(this.categoryFormService.value);
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
    this.categoryFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.categoryStateService.setState({ editModelData: null });
  }
}
