import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryStateService } from '../../../dashboard/services/category-state.service';
import { SliderModule } from 'primeng/slider';
import { BrandApiService } from '../../../dashboard/services/brand-api.service';
@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [FormsModule, SliderModule],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  providers: [DecimalPipe],
})
export class ProductFilterComponent {
  @ViewChild('slider', { read: ElementRef }) slider!: ElementRef;
  rangeValues: number[] = [20, 80];
  brandApiService = inject(BrandApiService);
  brandData: any[] = [];
  constructor(private decimalPipe: DecimalPipe) {
  }


  ngOnInit() {
    this.getAll()
  }

  getAll() {
    const select = ['id', 'name', 'image'];
    this.brandApiService.getAll('', { select }).subscribe((res) => {
      this.brandData = res.result.map((item)=>{
        return {...item,...{isSelected:false}}
      });
    });
  }
  
  toggle(event: MouseEvent) {
    const target = event.target as HTMLElement; // Type assertion
    const parentDiv = target.parentElement;
    if (parentDiv) {
      parentDiv.classList.toggle('filter--opened');
    }
  }

}

