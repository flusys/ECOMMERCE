import { Component, effect, Inject, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from "@angular/common";
import { AppTopBarComponent } from "../app-top-bar/app-top-bar.component";
import { filter } from "rxjs";
import { AppSidebarComponent } from "../app-sidebar/app-sidebar.component";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { AppFooterComponent } from "../app-footer/app-footer.component";
import {LayoutService} from "flusysng/layout/services";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,

    //Component
    AppTopBarComponent,
    AppSidebarComponent,
    AppFooterComponent
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent implements OnDestroy {

  menuOutsideClickListener!: any;
  profileMenuOutsideClickListener!: any;
  mobileSearchClickListener!: any;

  @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
  @ViewChild(AppTopBarComponent) appTopBar!: AppTopBarComponent;


  constructor(public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router, @Inject(DOCUMENT) private document: Document) {
    effect(() => {
      this.layoutService.state();
      if (!this.menuOutsideClickListener) {
        this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
            || this.appTopBar.menuButton.nativeElement.isSameNode(event.target) || this.appTopBar.menuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideMenu();
          }
        });
      }
      if (!this.profileMenuOutsideClickListener) {
        this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appTopBar.menu.nativeElement.isSameNode(event.target) || this.appTopBar.menu.nativeElement.contains(event.target)
            || this.appTopBar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopBar.topbarMenuButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideProfileMenu();
          }
        });
      }
      if (!this.mobileSearchClickListener) {
        this.mobileSearchClickListener = this.renderer.listen('document', 'click', event => {
          const isOutsideClicked = !(this.appTopBar.search.nativeElement.isSameNode(event.target) || this.appTopBar.search.nativeElement.contains(event.target)
            || this.appTopBar.topBarSearchButton.nativeElement.isSameNode(event.target) || this.appTopBar.topBarSearchButton.nativeElement.contains(event.target));

          if (isOutsideClicked) {
            this.hideMobileSearch();
          }
        });
      }
      if (this.layoutService.state().staticMenuMobileActive) {
        this.blockBodyScroll();
      }
    });

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
        this.hideProfileMenu();
      });
  }

  hideMenu() {
    this.layoutService.state.update((prev) => {
      prev.overlayMenuActive = false;
      prev.staticMenuMobileActive = false;
      prev.menuHoverActive = false;
      return structuredClone(prev);
    })
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
    this.layoutService.state.update((prev) => {
      prev.profileSidebarVisible = false;
      return structuredClone(prev);
    })
    if (this.profileMenuOutsideClickListener) {
      this.profileMenuOutsideClickListener();
      this.profileMenuOutsideClickListener = null;
    }
  }
  hideMobileSearch() {
    this.layoutService.state.update((prev) => {
      prev.mobileSearchBarActive = false;
      return structuredClone(prev);
    })
    if (this.mobileSearchClickListener) {
      this.mobileSearchClickListener();
      this.mobileSearchClickListener = null;
    }
  }

  blockBodyScroll(): void {
    if (this.document.body.classList) {
      this.document.body.classList.add('blocked-scroll');
    } else {
      this.document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (this.document.body.classList) {
      this.document.body.classList.remove('blocked-scroll');
    } else {
      this.document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
        'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive': this.layoutService.state().staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state().overlayMenuActive,
      'layout-mobile-active': this.layoutService.state().staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
    }
  }

  ngOnDestroy() {
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
