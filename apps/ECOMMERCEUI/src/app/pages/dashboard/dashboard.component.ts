import { Component } from '@angular/core';
import { BlockBannerComponent } from '../../modules/dashboard/components/block-banner/block-banner.component';
import { BlockBestSellersProductsComponent } from '../../modules/dashboard/components/block-best-sellers-products/block-best-sellers-products.component';
import { BlockBrandsComponent } from '../../modules/dashboard/components/block-brands/block-brands.component';
import { BlockCategoriesComponent } from '../../modules/dashboard/components/block-categories/block-categories.component';
import { BlockFeaturesComponent } from '../../modules/dashboard/components/block-features/block-features.component';
import { BlockPostsComponent } from '../../modules/dashboard/components/block-posts/block-posts.component';
import { BlockProductCarouselComponent } from '../../modules/dashboard/components/block-product-carousel/block-product-carousel.component';
import { BlockProductCollumsComponent } from '../../modules/dashboard/components/block-product-collums/block-product-collums.component';
import { BlockSlideshowComponent } from '../../modules/dashboard/components/block-slideshow/block-slideshow.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BlockBannerComponent,
    BlockBestSellersProductsComponent,
    BlockBrandsComponent,
    BlockCategoriesComponent,
    BlockFeaturesComponent,
    BlockPostsComponent,
    BlockProductCarouselComponent,
    BlockProductCollumsComponent,
    BlockSlideshowComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
