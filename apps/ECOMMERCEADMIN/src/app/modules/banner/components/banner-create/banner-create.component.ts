import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IBanner } from '../../interfaces/banner-data.interface';
import { BannerApiService } from '../../services/banner-api.service';
import { BannerFormService } from '../../services/banner-form.service';
import { BannerStateService } from '../../services/banner-state.service';
import { ImageModule } from 'primeng/image';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleryDialogeComponent } from '../../../gallery/components/gallery-dialoge/gallery-dialoge.component';
import { IGallery } from '../../../gallery/interfaces/gallery-data.interface';

@Component({
  selector: 'app-banner-create',
  imports: [
    AngularModule,
    PrimeModule,
    ImageModule,
  ],
  templateUrl: './banner-create.component.html',
  providers: [DialogService]
})
export class BannerCreateComponent {
  bannerFormService = inject(BannerFormService);
  bannerStateService = inject(BannerStateService);
  bannerApiService = inject(BannerApiService);
  dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  isPanelCollapsed = true;
  model: IBanner | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });

  //Image Dialog
  ref: DynamicDialogRef | undefined;

  constructor(
  ) {
    effect(() => {
      const model = this.bannerStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.bannerFormService.patchValue({ ...model });
      } else {
        this.model = undefined;
      }
    });
  }
  get image(): string | undefined {
    return this.bannerFormService?.value?.image;
  }

  get typeList() {
    return [
      { level: 'Top', value: 'top' },
      { level: 'Middle', value: 'middle' },
    ]
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
        this.bannerFormService.patchValue({
          [dialogFor]: multiple ? gallery.map((item) => item.url) : gallery[0].url
        })
      } else {
        this.bannerFormService.patchValue({
          [dialogFor]: null
        });
      }
    });
  }

  onSubmit() {
    if (this.bannerFormService.formGroup.invalid) {
      this.bannerFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.bannerFormService.formGroup.value;

    (this.model ? this.bannerApiService.update(data) : this.bannerApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.bannerFormService.patchValue({ id: res.result });
        this.bannerStateService.addOrUpdateDataList(this.bannerFormService.value);
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
    this.bannerFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.bannerStateService.setState({ editModelData: null });
  }
}
