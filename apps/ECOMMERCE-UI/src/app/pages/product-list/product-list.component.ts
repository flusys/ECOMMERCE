import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { ProductListSharedComponent } from '../../shared/components/product-list/product-list.component';
import { ProductListFiltersComponent } from '../../modules/product-list/components/product-list-filters/product-list-filters.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductListSharedComponent,
    PaginatorComponent,
    ProductListFiltersComponent

  ],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {
  showSortDropDown=false;
}
