import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  showCart = false;
  @ViewChild('mobileMenu') mobileMenu!: ElementRef;
  @ViewChild('mobileMenuOpenButton') mobileMenuOpenButton!: ElementRef;
  @ViewChild('mobileMenuBody') mobileMenuBody!: ElementRef;

  @ViewChild('mobileMenuSearch') mobileMenuSearch!: ElementRef;
  @ViewChild('mobileMenuSearchOpenButton') mobileMenuSearchOpenButton!: ElementRef;

  @ViewChild('megamenu') megamenu!: ElementRef;

  @ViewChild('departmentsMenuOpenBtn') departmentsMenuOpenBtn!: ElementRef;
  isOpenDepartmentMenu=false;

  constructor(private renderer: Renderer2,private router: Router,) {
  }

  get isHomePage(){
    return this.router.url=='/';
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as Element;
    const topbarDropdown: HTMLCollectionOf<Element> = document.getElementsByClassName('topbar-dropdown');
    Array.from(topbarDropdown).forEach(element => {
      if (element.isSameNode(targetElement) || element.contains(targetElement)) {
        element.classList.toggle('topbar-dropdown--opened')
      } else {
        element.classList.remove('topbar-dropdown--opened')
      }
    });

    const indicatorTrigger: HTMLCollectionOf<Element> = document.getElementsByClassName('indicator--trigger--click');
    Array.from(indicatorTrigger).forEach(element => {
      if (element.isSameNode(targetElement) || element.contains(targetElement)) {
        element.classList.toggle('indicator--opened')
      } else {
        element.classList.remove('indicator--opened')
      }
    });

    if (!this.mobileMenuBody.nativeElement.isSameNode(targetElement) && !this.mobileMenuBody.nativeElement.contains(targetElement)
      && !this.mobileMenuOpenButton.nativeElement.contains(targetElement)) {
      this.mobileMenu.nativeElement.classList.remove('mobilemenu--open')
    }

    if (!this.mobileMenuSearch.nativeElement.isSameNode(targetElement) && !this.mobileMenuSearch.nativeElement.contains(targetElement)
      && !this.mobileMenuSearchOpenButton.nativeElement.contains(targetElement)) {
      this.mobileMenuSearch.nativeElement.classList.remove('mobile-header__search--opened')
    }

    if (this.departmentsMenuOpenBtn.nativeElement.isSameNode(targetElement) || this.departmentsMenuOpenBtn.nativeElement.contains(targetElement)) {
      if(!this.isHomePage)
        this.isOpenDepartmentMenu=!this.isOpenDepartmentMenu;
    }else{
      this.isOpenDepartmentMenu=false;
    }
  }

  openMenu() {
    const body = document.body;
    const bodyWidth = body.clientWidth;
    this.renderer.setStyle(body, 'overflow', 'hidden');
    this.renderer.setStyle(body, 'paddingRight', `${body.clientWidth - bodyWidth}px`);
    this.renderer.addClass(this.mobileMenu.nativeElement, 'mobilemenu--open');
  }

  closeMenu() {
    const body = document.body;
    this.renderer.setStyle(body, 'overflow', 'auto');
    this.renderer.removeStyle(body, 'paddingRight');
    this.renderer.removeClass(this.mobileMenu.nativeElement, 'mobilemenu--open');
  }
  openMobileSearch() {
    this.renderer.addClass(this.mobileMenuSearch.nativeElement, 'mobile-header__search--opened');
  }

  closeMobileSearch() {
    this.renderer.removeClass(this.mobileMenuSearch.nativeElement, 'mobile-header__search--opened');
  }

  openCollapseMenu(event:MouseEvent){
    const target = event.target as HTMLElement; // Type assertion
    const parentDiv = target.parentElement?.parentElement;
    if (parentDiv) {
      parentDiv.classList.toggle('mobile-links__item--open')
    }
  }

  onMegaMenuMouseEnter(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const megamenu = target.querySelector('.nav-links__megamenu') as HTMLElement;
    if (megamenu) {
      const container = this.getOffsetParent(megamenu);
      if (container) {
        const containerWidth = container.clientWidth;
        const megamenuWidth = megamenu.clientWidth;
        const itemPosition = target.getBoundingClientRect().left - container.getBoundingClientRect().left; // Calculate position relative to container
        const megamenuPosition = Math.round(Math.min(itemPosition, containerWidth - megamenuWidth));

        this.renderer.setStyle(megamenu, 'left', `${megamenuPosition}px`);
      }
    }
  }

  private getOffsetParent(element: HTMLElement): HTMLElement | null {
    return element.offsetParent as HTMLElement;
  }

}
