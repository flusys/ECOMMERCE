import { Component } from '@angular/core';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';

@Component({
  selector: 'app-block-categories',
  standalone: true,
  imports: [
    CategoryCardComponent
  ],
  templateUrl: './block-categories.component.html',
  styleUrl: './block-categories.component.scss'
})
export class BlockCategoriesComponent {

}
