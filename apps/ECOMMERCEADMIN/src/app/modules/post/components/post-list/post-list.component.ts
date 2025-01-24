import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IPost } from '../../interfaces/psot-data.interface';
import { PostApiService } from '../../services/post-api.service';
import { PostStateService } from '../../services/post-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-post-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './post-list.component.html',
})
export class PostListComponent {
  postStateService = inject(PostStateService);
  postApiService = inject(PostApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedPost: IPost[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedPost = [];
    this.postStateService.withDeleted = !this.postStateService.withDeleted;
    if (!type) {
      if (this.postStateService.withDeleted) {
        this.postStateService.callApi();
      } else {
        this.postStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editPost(post: IPost) {
    this.postStateService.setState({ editModelData: null });
    this.postStateService.setState({ editModelData: post });
  }

  deleteOrRestore(type: string) {
    if (this.selectedPost.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedPost.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedPost.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.postApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.postStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select post first!"
      });
    }
  }


  clearAll() {
    this.selectedPost = []
  }
}
