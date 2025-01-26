import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NouiFormatter, NouisliderModule } from 'ng2-nouislider';
import { CategoryStateService } from '../../../dashboard/services/category-state.service';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [NouisliderModule, FormsModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  providers: [DecimalPipe],
})
export class ProductFilterComponent {
  @ViewChild('slider', { read: ElementRef }) slider!: ElementRef;
  sliderRange!: number[];

  someKeyboardConfig: object;

  categoryStateService=inject(CategoryStateService);
  constructor(private decimalPipe: DecimalPipe) {
    this.someKeyboardConfig = {
      connect: true,
      start: [400, 500],
      step: 10,
      tooltips: [
        new TimeFormatter(this.decimalPipe),
        new TimeFormatter(this.decimalPipe),
      ],
      range: {
        min: 0,
        max: 5000,
      },
      behaviour: 'drag',
    };
  }


  get categoryTree(){
    return this.categoryStateService.categoryTree();
  }

  toggle(event: MouseEvent) {
    console.warn(this.sliderRange);
    const target = event.target as HTMLElement; // Type assertion
    const parentDiv = target.parentElement;
    if (parentDiv) {
      parentDiv.classList.toggle('filter--opened');
    }
  }
}

export class TimeFormatter implements NouiFormatter {
  constructor(private decimalPipe: DecimalPipe) {}
  to(value: number): string {
    return this.decimalPipe.transform(value, '2.0') ?? '0';
  }
  from(value: string): number {
    return Number(value.split(':')[0]) * 60 + Number(value.split(':')[1]);
  }
}
