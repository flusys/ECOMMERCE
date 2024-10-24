import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListSharedComponent } from '../../shared/components/product-list/product-list.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    ProductListSharedComponent,
    PaginatorComponent
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {}
