import { Component, effect, ElementRef, inject, viewChild, viewChildren } from '@angular/core';
import { NgForm, FormControlName } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IGallery } from '../../interfaces/gallery-data.interface';
import { GalleryApiService } from '../../services/gallery-api.service';
import { GalleryFormService } from '../../services/gallery-form.service';
import { GalleryStateService } from '../../services/gallery-state.service';
import { FolderStateService } from '../../services/folder-state.service';
import { IFolder } from '../../interfaces/folder-data.interface';
import { DialogService } from 'primeng/dynamicdialog';
import { FolderCreateComponent } from '../folder-create/folder-create.component';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { UploadApiService } from '../../services/upload-api.service';

@Component({
  selector: 'app-gallery-create',
  imports: [
    AngularModule,
    PrimeModule
  ],
  templateUrl: './gallery-create.component.html',
  providers: [DialogService]
})
export class GalleryCreateComponent {
  galleryFormService = inject(GalleryFormService);
  galleryStateService = inject(GalleryStateService);
  galleryApiService = inject(GalleryApiService);
  private messageService = inject(MessageService);
  folderStateService = inject(FolderStateService);
  dialogService = inject(DialogService);
  uploadApiService = inject(UploadApiService);

  isPanelCollapsed = true;

  readonly inputForm = viewChild.required<NgForm>('inputForm');
  readonly formControls = viewChildren(FormControlName, { read: ElementRef });
  readonly fileUploader = viewChild.required<FileUpload>('fileUploader');

  constructor() {
  }

  get folderList() {
    return this.folderStateService.select('data')().result;
  }

  get selectedFolderName() {
    const selectedFolderId = this.galleryFormService.value.folder;
    return this.folderList.find(item => item.id == selectedFolderId)?.name;
  }

  addFolder(model: IFolder | null) {
    if (model != null) {
      this.folderStateService.setState({ editModelData: model });
    }
    this.dialogService.open(FolderCreateComponent, {
      header: 'Folder Create',
      closable: true,
    });
  }

  selectedFiles: any[] = [];
  onSelect(event: FileSelectEvent) {
    for (let file of event.files) {
      this.selectedFiles.push(file);
    }
  }

  onSubmit() {
    if (this.galleryFormService.formGroup.invalid) {
      this.galleryFormService.focusFirstInvalidInput(this.formControls() as ElementRef<any>[]);
      return;
    }


    let data = this.galleryFormService.formGroup.value;

    if (this.selectedFiles.length) {
      const fromData = new FormData();
      this.selectedFiles.forEach(file => {
        fromData.append('imageMulti', file);
      });
      this.uploadApiService.uploadMultipleImages(fromData, this.selectedFolderName ?? "").subscribe(res => {
        if (res.length) {
          const dataList = res.map(item => {
            return { ...item, ...{ folder: data.folder } };
          })
          this.galleryApiService.insertMany(dataList).subscribe(res => {
            if (res.success) {
              this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
              this.clearInputForm()
            } else {
              this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: res.message });
            }
          })
        }
      })
    } else {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: 'No Selected File Found' });
    }
  }


  clearInputForm() {
    this.galleryStateService.resetFilter();
    this.fileUploader().clear();
    this.galleryFormService.reset();
    this.inputForm().reset();
  }
}
