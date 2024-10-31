import { Component } from '@angular/core';
import { ProductDescriptionComponent } from '../../modules/product-details/components/product-description/product-description.component';
import { ProductReviewsComponent } from '../../modules/product-details/components/product-reviews/product-reviews.component';
import { ProductSpecificationComponent } from '../../modules/product-details/components/product-specification/product-specification.component';
import { RelatedProductsComponent } from '../../modules/product-details/components/related-products/related-products.component';
import { ProductContentComponent } from '../../shared/components/product-content/product-content.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ProductDescriptionComponent,
    ProductReviewsComponent,
    ProductSpecificationComponent,
    RelatedProductsComponent,
    ProductContentComponent
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  activeTab=1;
}
