import { Component, inject, input } from '@angular/core';
import { ProductRatingBarComponent } from '../../../../shared/components/product-rating-bar/product-rating-bar.component';
import { ReviewApiService } from '../../services/reviews-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularModule } from 'flusysng/shared/modules';
import { AuthStateService } from 'apps/ECOMMERCEUI/src/app/core/services/auth-state.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    AngularModule,
    ProductRatingBarComponent
  ],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss',
})
export class ProductReviewsComponent {
  productDetails = input<any>();
  reviewApiService = inject(ReviewApiService);
  authStateService = inject(AuthStateService);
  fb = inject(FormBuilder);
  reviewForm!: FormGroup;

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      star: [0, Validators.required],
      product: [this.productDetails().id, Validators.required],
      comment: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      this.reviewApiService.insert(this.reviewForm.value).subscribe(res => {
        console.warn(res);
      })
    }
  }

  getFormatedDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}
