import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { ITag } from '../../interfaces/tag-data.interface';
import { TagApiService } from '../../services/tag-api.service';
import { TagStateService } from '../../services/tag-state.service';

@Component({
  selector: 'app-tag-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
})
export class TagListComponent { 
  tagStateService = inject(TagStateService);
    tagApiService = inject(TagApiService);
    layoutService = inject(LayoutService);
    private messageService = inject(MessageService);
  
    constructor() {
    }
  
    selectedTag: ITag[] = [];
    globalFilterField: string[] = ['name', 'menu.name'];
  
  
    withDeletedItem(type?: number) {
      this.selectedTag = [];
      this.tagStateService.withDeleted = !this.tagStateService.withDeleted;
      if (!type) {
        if (this.tagStateService.withDeleted) {
          this.tagStateService.callApi();
        } else {
          this.tagStateService.deleteItemFromList('restore', []);
        }
      }
    }
  
  
    getInputString(event: any) {
      return event.target.value;
    }
  
    editTag(tag: ITag) {
      this.tagStateService.setState({ editModelData: null });
      this.tagStateService.setState({ editModelData: tag });
    }
  
    deleteOrRestore(type: string) {
      if (this.selectedTag.length) {
        let ids: number[] = [];
        if (type == 'restore') {
          ids = this.selectedTag.filter((item) => item.deletedAt).map((item) => item.id);
        } else {
          ids = this.selectedTag.filter((item) => !item.deletedAt).map((item) => item.id);
        }
  
        if (!ids.length) return;
        const deleteData: IDeleteData = {
          id: ids,
          type: type == 'restore' ? 'restore' : 'delete'
        }
        this.tagApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
          if (result.success) {
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
            this.tagStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
          detail: "Need to Select tag first!"
        });
      }
    }
  
  
    clearAll() {
      this.selectedTag = []
    }
}
