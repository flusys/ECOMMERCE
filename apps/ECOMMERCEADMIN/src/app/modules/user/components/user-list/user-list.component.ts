import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IUser } from '../../interfaces/user-data.interface';
import { UserApiService } from '../../services/user-api.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-user-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  userStateService = inject(UserStateService);
  userApiService = inject(UserApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedUser: IUser[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedUser = [];
    this.userStateService.withDeleted = !this.userStateService.withDeleted;
    if (!type) {
      if (this.userStateService.withDeleted) {
        this.userStateService.callApi();
      } else {
        this.userStateService.deleteItemFromList('restore', []);
      }
    }
  }

  get hasAccessOptions() {
    return [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];
  }

  getInputString(event: any) {
    return event.target.value;
  }



  changeHasAccess(id: number, event: any) {
    this.userApiService.updateHasAccess({ id, status: event.value }).subscribe(res => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: res.message });
    })
  }

  editUser(user: IUser) {
    this.userStateService.setState({ editModelData: null });
    this.userStateService.setState({ editModelData: user });
  }

  deleteOrRestore(type: string) {
    if (this.selectedUser.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedUser.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedUser.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.userApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.userStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
        detail: "Need to Select user first!"
      });
    }
  }


  clearAll() {
    this.selectedUser = []
  }
}
