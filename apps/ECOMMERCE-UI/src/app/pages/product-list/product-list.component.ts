import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { ProductListSharedComponent } from '../../shared/components/product-list/product-list.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductListSharedComponent,
    PaginatorComponent

  ],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {}
