import { Component, inject, signal } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IBanner } from '../../interfaces/banner-data.interface';
import { BannerApiService } from '../../services/banner-api.service';
import { BannerStateService } from '../../services/banner-state.service';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';

@Component({
  selector: 'app-banner-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './banner-list.component.html',
})
export class BannerListComponent {
  bannerStateService = inject(BannerStateService);
  bannerApiService = inject(BannerApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedBanner: IBanner[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedBanner = [];
    this.bannerStateService.withDeleted = !this.bannerStateService.withDeleted;
    if (!type) {
      if (this.bannerStateService.withDeleted) {
        this.bannerStateService.callApi();
      } else {
        this.bannerStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editBanner(banner: IBanner) {
    this.bannerStateService.setState({ editModelData: null });
    this.bannerStateService.setState({ editModelData: banner });
  }

  deleteOrRestore(type: string) {
    if (this.selectedBanner.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedBanner.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedBanner.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.bannerApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.bannerStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select banner first!"
      });
    }
  }


  clearAll() {
    this.selectedBanner = []
  }
}
