import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICompany } from '../../interfaces/company-data.interface';
import { CompanyApiService } from '../../services/company-api.service';
import { CompanyStateService } from '../../services/company-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-company-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
})
export class CompanyListComponent {
  companyStateService = inject(CompanyStateService);
  companyApiService = inject(CompanyApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedCompany: ICompany[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedCompany = [];
    this.companyStateService.withDeleted = !this.companyStateService.withDeleted;
    if (!type) {
      if (this.companyStateService.withDeleted) {
        this.companyStateService.callApi();
      } else {
        this.companyStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editCompany(company: ICompany) {
    this.companyStateService.setState({ editModelData: null });
    this.companyStateService.setState({ editModelData: company });
  }

  deleteOrRestore(type: string) {
    if (this.selectedCompany.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedCompany.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedCompany.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.companyApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.companyStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select company first!"
      });
    }
  }


  clearAll() {
    this.selectedCompany = []
  }
}
