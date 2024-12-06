import { Injectable } from '@angular/core';
import { IMenu } from '../interfaces/menu.interfaces';
import { AuthenticationStateService } from '../../auth/service/authentication-state.service';

@Injectable({
  providedIn: 'root',
})
export class MenuStateService {
  menus: Array<IMenu> = [
    {
      name: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/'],
    },
    {
      name: 'Family Tree',
      icon: 'pi pi-sitemap',
      routerLink: ['/family-tree'],
    },
    {
      name: 'Basic Information',
      icon: 'pi pi-id-card',
      routerLink: ['/basic-information'],
    },
    {
      name: 'Lineage',
      icon: 'pi pi-sitemap',
      routerLink: ['/lineage'],
    },
    {
      name: 'Refer User',
      icon: 'pi pi-users',
      items: [
        {
          name: 'Generate Link',
          icon: 'pi pi-link',
          routerLink: ['/refer-user/generate-link'],
        },
        {
          name: 'Referred Users',
          icon: 'pi pi-users',
          routerLink: ['/refer-user/refer-user-list'],
        },
      ],
    },
    {
      name: 'User',
      icon: 'pi pi-users',
      items: [
        {
          name: 'User List',
          icon: 'pi pi-list',
          routerLink: ['/user/user-list'],
        },
      ],
    },
    {
      name: 'Address Setup',
      icon: 'pi pi-cog',
      items: [
        {
          name: 'Continent Setup',
          icon: 'pi pi-cog',
          routerLink: ['/address-setup/continent-setup'],
        },
        {
          name: 'Country Setup',
          icon: 'pi pi-cog',
          routerLink: ['/address-setup/country-setup'],
        },
        {
          name: 'Division Setup',
          icon: 'pi pi-cog',
          routerLink: ['/address-setup/division-setup'],
        },
        {
          name: 'District Setup',
          icon: 'pi pi-cog',
          routerLink: ['/address-setup/district-setup'],
        },
        {
          name: 'Sub-District Setup',
          icon: 'pi pi-cog',
          routerLink: ['/address-setup/sub-district-setup'],
        },
      ],
    },
    {
      name: 'Payment',
      icon: 'pi pi-address-book',
      items: [
        {
          name: 'Submit Payment Info',
          icon: 'pi pi-address-book',
          routerLink: ['/user-payment/submit-payment-information'],
        },
        {
          name: 'Payment List',
          icon: 'pi pi-align-justify',
          routerLink: ['/user-payment/payment-information-list'],
        },
      ],
    },
    {
      name: 'Reviewer',
      icon: 'pi pi-users',
      routerLink: ['/reviewer'],
    },
  ];

  adminMenu: Array<IMenu> = [
    {
      name: 'Home',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/'],
    },
    {
      name: 'Family Tree',
      icon: 'pi pi-sitemap',
      routerLink: ['/family-tree'],
    },
    {
      name: 'Basic Information',
      icon: 'pi pi-id-card',
      routerLink: ['/basic-information'],
    },
    {
      name: 'Refer User',
      icon: 'pi pi-users',
      items: [
        {
          name: 'Generate Link',
          icon: 'pi pi-link',
          routerLink: ['/refer-user/generate-link'],
        },
        {
          name: 'Referred Users',
          icon: 'pi pi-users',
          routerLink: ['/refer-user/refer-user-list'],
        },
      ],
    },
    {
      name: 'User',
      icon: 'pi pi-users',
      items: [
        {
          name: 'User List',
          icon: 'pi pi-list',
          routerLink: ['/user/user-list'],
        },
      ],
    },
    {
      name: 'Payment',
      icon: 'pi pi-address-book',
      items: [
        {
          name: 'Submit Payment Info',
          icon: 'pi pi-address-book',
          routerLink: ['/user-payment/submit-payment-information'],
        },
        {
          name: 'Payment List',
          icon: 'pi pi-align-justify',
          routerLink: ['/user-payment/payment-information-list'],
        },
      ],
    }
  ];

  constructor(private authenticationStateService: AuthenticationStateService) {}

  getCurrentUserMenu() {
        return this.menus;
  }

  checkUrl(url: string, menus: Array<IMenu>): boolean {
    let find = false;
    for (let index = 0; index < menus.length; index++) {
      const element = menus[index];
      if ((element?.routerLink ?? [''])[0] == url) return true;
      else if (element.items?.length && this.checkUrl(url, element.items))
        return true;
    }
    return find;
  }
}
