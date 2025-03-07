import { Component, effect, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './core/components/site-header/site-header.component';
import { SiteFooterComponent } from './core/components/site-footer/site-footer.component';
import { ProductContentComponent } from './shared/components/product-content/product-content.component';
import { ToastModule } from 'primeng/toast';
import { DOCUMENT } from '@angular/common';
import { GlobalStateService } from './shared/services/global-state.service';
import { AuthApiService } from './modules/auth/services/auth-api.service';
import { AuthStateService } from './core/services/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    SiteFooterComponent,
    ProductContentComponent,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  globalStateService = inject(GlobalStateService);
  showProductQuickView = false;
  quickViewProduct = null;
  authApiService = inject(AuthApiService);
  authStateService = inject(AuthStateService);

  constructor(
  ) {
    effect(() => {
      this.quickViewProduct = this.globalStateService.selectedQuickViewProduct();
      if (this.quickViewProduct && this.quickViewProduct != null) {
        this.showProductQuickView = true;
      }
    })
  }

  ngOnInit() {
    this.authApiService.checkLogin().subscribe((res) => {
      if (res) {
        this.authStateService.loginUserData.set(res);
      }else{
        this.authStateService.loginUserData.set(null);
      }
    });
  }

  quickViewClose() {
    this.showProductQuickView = false;
  }
}
