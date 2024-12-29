import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ICategory } from '../interfaces/category-data.interface';

@Component({
  selector: 'app-category-tree',
  template: `
        <ul>
          @for (category of categoryTree(); track category.name; let i = $index) {
          <li>
              <label>
              <input autocomplete="false" type="checkbox" [checked]="category.id==parentId()" (change)="changeItem(category,$event)">
                {{ category.name }}
              </label>
              @if((category?.children.length??0) > 0){
                <app-category-tree [categoryTree]="category.children" (itemSelected)="handleItemSelection($event)" [parentId]="parentId()"></app-category-tree>
              }
            </li>
          }
        </ul>
      `,
  styles: [
    'li {list-style:none}',
    'input {cursor:pointer}'
  ],
  standalone: true,
  imports: [CommonModule]
})
export class AppTreeCategoryComponent {
  categoryTree = input<ICategory[]>([]);
  parentId = input<number>(0);
  itemSelected = output<{ item: ICategory, value: boolean }>();

  handleItemSelection(value: { item: ICategory, value: boolean }) {
    this.itemSelected.emit(value);
  }

  changeItem(item: ICategory, $event: any) {
    const copy = { ...item }
    delete (copy as any)?.children;
    this.itemSelected.emit({ item: copy, value: $event.target.checked });
  }

}
