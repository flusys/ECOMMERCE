import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationStateService } from '../../../../auth/service/authentication-state.service';
import { Listbox } from 'primeng/listbox';
import { PrimeModule } from '@ecommerce/shared';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PrimeModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  options!: any[];
  @ViewChild('myListBox') myListBoxComponent!: Listbox;

  constructor(
    private authenticationStateService: AuthenticationStateService,
    ) {
  }

  get loginUserData(){
    return this.authenticationStateService.loginUserData();
  }

  ngOnInit() {
    this.options = [
      { icon: 'pi-cog', name: 'Manage Account', code: 'manage-account' },
      { icon: 'pi-sign-out', name: 'Logout', code: 'logout' },
    ];
  }

  clickOption(event: { value: any; }) {
    this.myListBoxComponent.modelValue.set(null);
    if (event.value == 'logout')
      this.logout();
  }

  logout() {
    this.authenticationStateService.logout();
  }
}
