import { Component, inject, signal } from '@angular/core';
import { ProductDescriptionComponent } from '../../modules/product-details/components/product-description/product-description.component';
import { ProductReviewsComponent } from '../../modules/product-details/components/product-reviews/product-reviews.component';
import { ProductSpecificationComponent } from '../../modules/product-details/components/product-specification/product-specification.component';
import { RelatedProductsComponent } from '../../modules/product-details/components/related-products/related-products.component';
import { ProductContentComponent } from '../../shared/components/product-content/product-content.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductApiService } from '../../modules/dashboard/services/product-api.service';

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

  productId!: string;
  route=inject(ActivatedRoute);
  productApiService=inject(ProductApiService);

  productDetails=signal({});

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productId = id;
        this.productApiService.getParentProductById(this.productId).subscribe(res=>{
         this.productDetails.set(res.result);
        })
      } else {
        console.error('Product ID is null');
      }
    });
  }

}
