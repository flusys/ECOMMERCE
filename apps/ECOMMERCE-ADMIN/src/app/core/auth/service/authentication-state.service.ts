import { Injectable, signal } from '@angular/core';
import { ILoggedUserInfo } from '../interface/logged-user-info.interface';
import { Router } from '@angular/router';
import { IMenu } from '../../layout/interfaces/menu.interfaces';
import {PlatformService} from "flusysng/shared/services";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationStateService {
  isInitLoad = true;
  loginUserData = signal<ILoggedUserInfo | null>(null);

  loginUserMenu = signal<Array<IMenu>  | null>(null);

  constructor(private router: Router,
    private platformService: PlatformService
  ) { }

  navigateLogin() {
    const pathName = window.location.pathname;
    if (!pathName.includes('/auth')) {
      this.router.navigate(['/auth/login'])
    }
  }

  navigateBaseUrl() {
    const pathName = window.location.pathname;
    if (pathName.includes('/auth')) {
      this.router.navigate(['/'])
    }
  }

  logout() {
    this.removeToken();
    this.router.navigate(['/auth/login'])
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getToken() {
    return !this.platformService.isServer ? localStorage.getItem('token') ?? "" : "";
  }
}
