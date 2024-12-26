import { Component, inject, signal } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { IBrand } from '../../interfaces/brand-data.interface';
import { BrandApiService } from '../../services/brand-api.service';
import { BrandStateService } from '../../services/brand-state.service';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';

@Component({
  selector: 'app-brand-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss',
})
export class BrandListComponent {
  brandStateService = inject(BrandStateService);
  brandApiService = inject(BrandApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedBrand: IBrand[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedBrand = [];
    this.brandStateService.withDeleted = !this.brandStateService.withDeleted;
    if (!type) {
      if (this.brandStateService.withDeleted) {
        this.brandStateService.callApi();
      } else {
        this.brandStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editBrand(brand: IBrand) {
    this.brandStateService.setState({ editModelData: null });
    this.brandStateService.setState({ editModelData: brand });
  }

  deleteOrRestore(type: string) {
    if (this.selectedBrand.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedBrand.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedBrand.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.brandApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.brandStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select brand first!"
      });
    }
  }


  clearAll() {
    this.selectedBrand = []
  }
}
