import { Component } from '@angular/core';
import { CategoryListComponent } from '../../modules/category/components/category-list/category-list.component';
import { CategoryCreateComponent } from '../../modules/category/components/category-create/category-create.component';

@Component({
  selector: 'app-category',
  imports: [
    CategoryListComponent,
    CategoryCreateComponent
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {}
