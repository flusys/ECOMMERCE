import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IFolder } from '../../interfaces/folder-data.interface';
import { FolderApiService } from '../../services/folder-api.service';
import { FolderFormService } from '../../services/folder-form.service';
import { FolderStateService } from '../../services/folder-state.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-folder-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './folder-create.component.html',
})
export class FolderCreateComponent {
  folderFormService = inject(FolderFormService);
  folderStateService = inject(FolderStateService);
  folderApiService = inject(FolderApiService);
  private messageService = inject(MessageService);
  dynamicDialogConfig = inject(DynamicDialogConfig);

  model: IFolder | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  constructor() {
    effect(() => {
      const model = this.folderStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.folderFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }


  onSubmit() {
    if (this.folderFormService.formGroup.invalid) {
      this.folderFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.folderFormService.formGroup.value;

    (this.model ? this.folderApiService.update(data) : this.folderApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.folderFormService.patchValue({ id: res.result });
        this.folderStateService.addOrUpdateDataList(this.folderFormService.value);
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
    this.folderFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.folderStateService.setState({ editModelData: null });
  }
}
