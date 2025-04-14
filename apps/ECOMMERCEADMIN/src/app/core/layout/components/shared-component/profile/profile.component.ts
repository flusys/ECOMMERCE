import { Component, inject, OnInit, Signal, viewChild, ViewChild } from '@angular/core';
import { Listbox } from 'primeng/listbox';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { AuthenticationStateService } from 'flusysng/auth/services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    PrimeModule,
    AngularModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  options!: any[];
  myListBoxComponent: Signal<Listbox | undefined> = viewChild<Listbox>('myListBox');

  private router: Router = inject(Router);

  constructor(
    private authenticationStateService: AuthenticationStateService,
  ) {
  }

  get loginUserData(): any {
    return this.authenticationStateService.loginUserData();
  }

  ngOnInit() {
    this.options = [
      { icon: 'pi-cog', name: 'Manage Account', code: 'manage-account' },
      { icon: 'pi-sign-out', name: 'Logout', code: 'logout' },
    ];
  }

  clickOption(event: { value: any; }) {
    this.myListBoxComponent()?.modelValue.set(null);
    if (event.value == 'logout')
      this.logout();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }
}
