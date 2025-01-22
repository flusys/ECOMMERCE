import { Component, inject } from '@angular/core';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { IGallery } from '../../interfaces/gallery-data.interface';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GalleryCreateComponent } from '../gallery-create/gallery-create.component';
import { GalleryStateService } from '../../services/gallery-state.service';
import { GalleryApiService } from '../../services/gallery-api.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-gallery-dialoge',
  imports: [
    AngularModule,
    PrimeModule,
    ImageModule,
    GalleryCreateComponent
  ],
  templateUrl: './gallery-dialoge.component.html',
  providers: [DialogService]
})
export class GalleryDialogeComponent {
 galleryStateService = inject(GalleryStateService);
 galleryApiService = inject(GalleryApiService);

  constructor(
    private messageService: MessageService,
    public dialogService: DialogService,
    public config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {
  }

  get configData() {
    return this.config.data;
  }

  selectedGallery: IGallery[] = [];


  selectImage(gallery: IGallery) {
    if (this.configData && !this.configData.multiple && this.selectedGallery.length) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "You Just Need to Select One Image" });
    } else {
      if (!this.selectedGallery.find((item) => item.id == gallery.id)) {
        this.selectedGallery.push(gallery);
      }
    }
  }

  removeSelected(index: number) {
    this.selectedGallery.splice(index, 1);
  }


  closeDialog(type: string) {
    if (type == 'close') {
      this.dialogRef.close([]);
    } else {
      if (this.selectedGallery.length) {
        this.dialogRef.close(this.selectedGallery);
      } else {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: "You Need to Select Image" });
      }
    }
  }

  onPageChange(event: any) {
    const newData = { pageSize: event.rows, currentPage: event.page }
    this.galleryStateService.setState({ pagination: newData })
  }

}
