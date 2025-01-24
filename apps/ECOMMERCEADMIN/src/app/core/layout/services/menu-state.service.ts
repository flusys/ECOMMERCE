import { Injectable } from '@angular/core';
import { IMenu } from '../interfaces/menu.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  superAdminMenu: Array<IMenu> = [
    {
      name: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/dashboard'],
    },
    {
      name: 'Category',
      icon: 'pi pi-sitemap',
      routerLink: ['/category'],
    },
    {
      name: 'Brand',
      icon: 'pi pi-id-card',
      routerLink: ['/brand'],
    },
    {
      name: 'Company',
      icon: 'pi pi-bookmark',
      routerLink: ['/company'],
    },
    {
      name: 'Tag',
      icon: 'pi pi-tags',
      routerLink: ['/tag'],
    },
    {
      name: 'Attribute',
      icon: 'pi pi-cog',
      routerLink: ['/attribute'],
    },
    {
      name: 'Gallery',
      icon: 'pi pi-images',
      routerLink: ['/gallery'],
    },
    {
      name: 'Create Product',
      icon: 'pi pi-plus',
      routerLink: ['/create-product'],
    },
    {
      name: 'Product List',
      icon: 'pi pi-align-justify',
      routerLink: ['/product-list'],
    },
    {
      name: 'Posts',
      icon: 'pi pi-address-book',
      routerLink: ['/post'],
    },
  ];

  constructor() {}

  getCurrentUserMenu() {
    return this.superAdminMenu;
  }

  checkUrl(url: string, menus: Array<IMenu>): boolean {
    for (let index = 0; index < menus.length; index++) {
      const element = menus[index];
      if ((element?.routerLink ?? [''])[0] == url) return true;
      else if (element.items?.length && this.checkUrl(url, element.items))
        return true;
    }
    return false;
  }
}
