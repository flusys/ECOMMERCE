import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryCardComponent } from '../../../../shared/components/category-card/category-card.component';
import { CategoryApiService } from '../../services/category-api.service';

@Component({
  selector: 'app-block-categories',
  standalone: true,
  imports: [
    CategoryCardComponent
  ],
  templateUrl: './block-categories.component.html',
  styleUrl: './block-categories.component.scss'
})
export class BlockCategoriesComponent implements OnInit {
  categoryApiService = inject(CategoryApiService);
  categoryData: any[] = [];

  categories = signal<any[]>([])

  ngOnInit() {
    this.getAll()
  }

  getAll() {
    const select = ['id', 'name', 'image', 'description', 'isPopular'];
    const filter = {
      isPopular: true
    }
    const pagination = {
      pageSize: 6,
      currentPage: 0
    }
    this.categoryApiService.getAll('', { select, filter, pagination }).subscribe((res) => {
      this.categories.set(res.result);
    });
  }

}
