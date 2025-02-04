import { Component, effect, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './core/components/site-header/site-header.component';
import { SiteFooterComponent } from './core/components/site-footer/site-footer.component';
import { ProductContentComponent } from './shared/components/product-content/product-content.component';
import { ToastModule } from 'primeng/toast';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { GlobalStateService } from './shared/services/global-state.service';

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
export class AppComponent {
  title = 'ECOMMERCE_TEMP';
  globalStateService = inject(GlobalStateService);
  showProductQuickView = false;
  quickViewProduct = null;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    effect(() => {
      this.quickViewProduct = this.globalStateService.selectedQuickViewProduct();
      if (this.quickViewProduct && this.quickViewProduct != null) {
        this.showProductQuickView = true;
      }
    })
  }


  quickViewClose() {
    this.showProductQuickView = false;
  }
}
