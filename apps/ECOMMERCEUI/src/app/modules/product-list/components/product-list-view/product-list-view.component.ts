import { Component, inject, signal } from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { CommonModule } from '@angular/common';
import { ProductHorizontalCardComponent } from '../../../../shared/components/product-horizontal-card/product-horizontal-card.component';
import { ProductApiService } from '../../../dashboard/services/product-api.service';

@Component({
  selector: 'app-product-list-view',
  standalone: true,
  imports: [
    CommonModule,
    ProductVerticalCardComponent,
    ProductHorizontalCardComponent
  ],
  templateUrl: './product-list-view.component.html',
  styleUrl: './product-list-view.component.scss'
})
export class ProductListViewComponent {
  activeLayout: number = 1;

  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);

  totalProduct=signal(0);
  totalPage=signal(0);
  
  currentPage=signal(0);
  pageSize=signal(10);

  ngOnInit() {
    this.getAllData();
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPage() }, (_, i) => i);
  }

  getVariantName(product: any) {
    if (product?.variants && product?.variants.length) {
      return product?.variants?.reduce((prev: any, cur: any) => {
        return prev + (cur?.attribute as any)?.name + ':' + cur?.name + ', ';
      }, '');
    }
    return "";
  }

  setPage(page: number) {
    this.currentPage.set(page);
    this.getAllData();
  }

  getAllData(){
    this.productApiService.getAll('', {  }).subscribe(res => {
      this.products.set(res.result);
      this.totalProduct.set(res.total??0);

      this.totalPage.set(Math.ceil(this.totalProduct() / this.pageSize()));
    })
  }

}
