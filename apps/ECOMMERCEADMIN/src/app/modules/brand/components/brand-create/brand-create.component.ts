import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IBrand } from '../../interfaces/brand-data.interface';
import { BrandApiService } from '../../services/brand-api.service';
import { BrandFormService } from '../../services/brand-form.service';
import { BrandStateService } from '../../services/brand-state.service';
import { ImageModule } from 'primeng/image';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleryDialogeComponent } from '../../../gallery/components/gallery-dialoge/gallery-dialoge.component';
import { IGallery } from '../../../gallery/interfaces/gallery-data.interface';

@Component({
  selector: 'app-brand-create',
  imports: [
    AngularModule,
    PrimeModule,
    ImageModule,
  ],
  templateUrl: './brand-create.component.html',
  providers: [DialogService]
})
export class BrandCreateComponent {
  brandFormService = inject(BrandFormService);
  brandStateService = inject(BrandStateService);
  brandApiService = inject(BrandApiService);
  dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IBrand | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  //Image Dialog
  ref: DynamicDialogRef | undefined;

  constructor(
  ) {
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
  get image(): string|undefined {
    return this.brandFormService?.value?.image;
  }


  openImageDialog(dialogFor: string, multiple: boolean) {
    this.ref = this.dialogService.open(GalleryDialogeComponent, {
      data: {
        for: 'select',
        multiple: multiple,
      },
      header: 'Select a Image',
      width: '70%',
      showHeader: false,
    });

    this.ref.onClose.subscribe((gallery: IGallery[]) => {
      if (gallery && gallery.length) {
        this.brandFormService.patchValue({
          [dialogFor]: multiple ? gallery.map((item) => item.url) : gallery[0].url
        })
      }else{
        this.brandFormService.patchValue({
          [dialogFor]: null
        });
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
