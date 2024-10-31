import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './core/components/site-header/site-header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SiteFooterComponent } from './core/components/site-footer/site-footer.component';
import { ProductContentComponent } from './shared/components/product-content/product-content.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SiteHeaderComponent,
    DashboardComponent,
    SiteFooterComponent,
    ProductContentComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ECOMMERCE_TEMP';

  quickViewClose() {
    const quickView = document.getElementById('product-quick-view');
    quickView?.style.setProperty('display', 'none');
  }
}
