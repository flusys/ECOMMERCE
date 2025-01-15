import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IGallery } from '../../interfaces/gallery-data.interface';
import { GalleryApiService } from '../../services/gallery-api.service';
import { GalleryStateService } from '../../services/gallery-state.service';

@Component({
  selector: 'app-gallery-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './gallery-list.component.html',
})
export class GalleryListComponent {
  galleryStateService = inject(GalleryStateService);
  galleryApiService = inject(GalleryApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedGallery: IGallery[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedGallery = [];
    this.galleryStateService.withDeleted = !this.galleryStateService.withDeleted;
    if (!type) {
      if (this.galleryStateService.withDeleted) {
        this.galleryStateService.callApi();
      } else {
        this.galleryStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  deleteOrRestore(type: string) {
    if (this.selectedGallery.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedGallery.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedGallery.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.galleryApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.galleryStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
          if (type == 'restore')
            this.withDeletedItem(1);
          this.clearAll()
        } else {
          this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: result.message });
        }
      }, (err) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Sorry!',
          detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
        });
      })
    } else {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: "Need to Select gallery first!"
      });
    }
  }

  onPageChange(event:any){

  }

  clearAll() {
    this.selectedGallery = []
  }
}
