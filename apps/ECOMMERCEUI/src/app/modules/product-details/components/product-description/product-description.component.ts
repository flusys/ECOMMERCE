import { Component, input } from '@angular/core';
import { AngularModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-product-description',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './product-description.component.html',
  styleUrl: './product-description.component.scss'
})
export class ProductDescriptionComponent {
  productDetails = input.required<any>();
}
