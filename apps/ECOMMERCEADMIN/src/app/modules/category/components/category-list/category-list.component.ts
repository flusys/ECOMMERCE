import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ICategory } from '../../interfaces/category-data.interface';
import { CategoryApiService } from '../../services/category-api.service';
import { CategoryStateService } from '../../services/category-state.service';

@Component({
  selector: 'app-category-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {

  categoryStateService = inject(CategoryStateService);
  categoryApiService = inject(CategoryApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedCategory: ICategory[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedCategory = [];
    this.categoryStateService.withDeleted = !this.categoryStateService.withDeleted;
    if (!type) {
      if (this.categoryStateService.withDeleted) {
        this.categoryStateService.callApi();
      } else {
        this.categoryStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editCategory(category: ICategory) {
    this.categoryStateService.setState({ editModelData: null });
    this.categoryStateService.setState({ editModelData: category });
  }

  deleteOrRestore(type: string) {
    if (this.selectedCategory.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedCategory.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedCategory.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.categoryApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.categoryStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select category first!"
      });
    }
  }


  clearAll() {
    this.selectedCategory = []
  }

}
