import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IPostCategory } from '../../interfaces/post-category-data.interface';
import { PostCategoryApiService } from '../../services/post-category-api.service';
import { PostCategoryStateService } from '../../services/post-category-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-post-category-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './post-category-list.component.html',
})
export class PostCategoryListComponent {
  postCategoryStateService = inject(PostCategoryStateService);
  postCategoryApiService = inject(PostCategoryApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedPostCategory: IPostCategory[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedPostCategory = [];
    this.postCategoryStateService.withDeleted = !this.postCategoryStateService.withDeleted;
    if (!type) {
      if (this.postCategoryStateService.withDeleted) {
        this.postCategoryStateService.callApi();
      } else {
        this.postCategoryStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editPostCategory(attribute: IPostCategory) {
    this.postCategoryStateService.setState({ editModelData: null });
    this.postCategoryStateService.setState({ editModelData: attribute });
  }

  deleteOrRestore(type: string) {
    if (this.selectedPostCategory.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedPostCategory.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedPostCategory.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.postCategoryApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.postCategoryStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select attribute first!"
      });
    }
  }


  clearAll() {
    this.selectedPostCategory = []
  }
}
