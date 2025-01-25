import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss'
})
export class CategoryCardComponent {
  category=input({
    name:'',
    image:'',
    description:''
  });
}
