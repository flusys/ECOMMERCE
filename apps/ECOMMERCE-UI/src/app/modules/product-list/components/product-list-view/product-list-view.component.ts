import { Component } from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { CommonModule } from '@angular/common';
import { ProductHorizontalCardComponent } from '../../../../shared/components/product-horizontal-card/product-horizontal-card.component';

@Component({
  selector: 'app-product-list-view',
  standalone: true,
  imports: [
    CommonModule,
    ProductVerticalCardComponent,
    ProductHorizontalCardComponent
  ],
  templateUrl: './product-list-view.component.html',
  styleUrl: './product-list-view.component.scss'
})
export class ProductListViewComponent {
  activeLayout:number=1;
}
