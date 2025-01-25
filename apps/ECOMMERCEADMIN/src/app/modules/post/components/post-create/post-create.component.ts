import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IPost } from '../../interfaces/post-data.interface';
import { PostApiService } from '../../services/post-api.service';
import { PostFormService } from '../../services/post-form.service';
import { PostStateService } from '../../services/post-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { EditorModule } from 'primeng/editor';
import { GalleryDialogeComponent } from '../../../gallery/components/gallery-dialoge/gallery-dialoge.component';
import { IGallery } from '../../../gallery/interfaces/gallery-data.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageModule } from 'primeng/image';
import { PostCategoryStateService } from '../../services/post-category-state.service';
import { IPostCategory } from '../../interfaces/post-category-data.interface';

@Component({
  selector: 'app-post-create',
  imports: [
    AngularModule,
    PrimeModule,
    EditorModule,
    ImageModule,
  ],
  templateUrl: './post-create.component.html',
  providers: [DialogService]
})
export class PostCreateComponent {
  postFormService = inject(PostFormService);
  postStateService = inject(PostStateService);
  postCategoryStateService = inject(PostCategoryStateService);
  postApiService = inject(PostApiService);
  private messageService = inject(MessageService);
  dialogService = inject(DialogService);

  isPanelCollapsed = true;
  model: IPost | undefined;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });


  //Image Dialog
  ref: DynamicDialogRef | undefined;


  get formValue() {
    return this.postFormService?.value;
  }

  constructor() {
    effect(() => {
      const model = this.postStateService.select('editModelData')() ?? undefined;
      if (model) {
        this.model = model;
        this.isPanelCollapsed = false;
        this.postFormService.patchValue({ ...model, ...{ category: (model?.category as IPostCategory)?.id ?? 0 } });
      } else {
        this.model = undefined;
      }
    });
  }

  get postCategoryList() {
    return this.postCategoryStateService.select('data')().result;
  }


  onSubmit() {
    if (this.postFormService.formGroup.invalid) {
      this.postFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }
    let data = this.postFormService.formGroup.value;

    (this.model ? this.postApiService.update(data) : this.postApiService.insert(data)).pipe(take(1)).subscribe((res) => {
      if (res.success) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
        this.postFormService.patchValue({ id: res.result });
        this.postStateService.addOrUpdateDataList(this.postFormService.value);
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

  get image(): string | undefined {
    return this.postFormService?.value?.image;
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
        this.postFormService.patchValue({
          [dialogFor]: multiple ? gallery.map((item) => item.url) : gallery[0].url
        })
      } else {
        this.postFormService.patchValue({
          [dialogFor]: null
        });
      }
    });
  }

  clearInputForm() {
    this.postFormService.reset();
    this.inputForm().reset();
    this.model = undefined;
    this.postStateService.setState({ editModelData: null });
  }
}
