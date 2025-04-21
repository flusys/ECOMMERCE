import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryStateService } from '../../../dashboard/services/category-state.service';
import { SliderModule } from 'primeng/slider';
import { BrandApiService } from '../../../dashboard/services/brand-api.service';
import { Router } from '@angular/router';
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
  router = inject(Router);
  brandData: any[] = [];

  constructor(private decimalPipe: DecimalPipe) {
  }
  selectedBrandIds: number[] = [];


  ngOnInit() {
    this.getAll()
  }

  getAll() {
    const select = ['id', 'name', 'image'];
    this.brandApiService.getAll('', { select }).subscribe((res) => {
      this.brandData = res.result.map((item) => {
        return { ...item, ...{ isSelected: false } }
      });
    });
  }

  toggle(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const parentDiv = target.parentElement;
    if (parentDiv) {
      parentDiv.classList.toggle('filter--opened');
    }
  }

  isSelected(id: number): boolean {
    return this.selectedBrandIds.find((item) => item == id) !== undefined;
  }

  selectBrand(id: number) {
    const find = this.selectedBrandIds.find((item) => item == id);
    if (find) {
      this.selectedBrandIds = this.selectedBrandIds.filter(id => id !== id);
    } else {
      this.selectedBrandIds.push(id);
    }
  }



  filter() {
    const priceMin = this.rangeValues[0]
    const priceMax = this.rangeValues[1]
    const brandIds = this.selectedBrandIds.join(',');
    this.router.navigate(['/product-list'], {
      queryParams: { priceMax, priceMin, brandIds }
    });
  }

  resetFilter() {
    this.selectedBrandIds = [];
    this.rangeValues = [0, 80];
    this.router.navigate(['/product-list']);
  }

}

