import { Component } from '@angular/core';
import { UserCreateComponent } from '../../modules/user/components/user-create/user-create.component';
import { UserListComponent } from '../../modules/user/components/user-list/user-list.component';

@Component({
  selector: 'app-user',
  imports: [
    UserCreateComponent,
    UserListComponent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent { }
