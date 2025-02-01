import { Component, inject, input } from '@angular/core';
import { ProductRatingBarComponent } from '../../../../shared/components/product-rating-bar/product-rating-bar.component';
import { ReviewApiService } from '../../services/reviews-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularModule } from 'flusysng/shared/modules';

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
  fb = inject(FormBuilder);
  reviewForm!: FormGroup;

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [0, Validators.required],
      comment: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.reviewForm.valid) {
      console.log(this.reviewForm.value);
      // Handle form submission
    }
  }

}
