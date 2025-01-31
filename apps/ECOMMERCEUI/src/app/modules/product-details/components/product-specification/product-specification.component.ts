import { Component, input } from '@angular/core';
import { AngularModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-product-specification',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './product-specification.component.html',
  styleUrl: './product-specification.component.scss'
})
export class ProductSpecificationComponent {
  productDetails = input<any>();
}
