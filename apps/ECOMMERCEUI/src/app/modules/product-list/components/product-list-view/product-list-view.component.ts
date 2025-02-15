import { Component, inject, signal } from '@angular/core';
import { ProductVerticalCardComponent } from '../../../../shared/components/product-vertical-card/product-vertical-card.component';
import { CommonModule } from '@angular/common';
import { ProductHorizontalCardComponent } from '../../../../shared/components/product-horizontal-card/product-horizontal-card.component';
import { ProductApiService } from '../../../dashboard/services/product-api.service';
import { ActivatedRoute } from '@angular/router';

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
  activeRoute = inject(ActivatedRoute);
  productApiService = inject(ProductApiService);
  products = signal<any[]>([]);

  totalProduct = signal(0);
  totalPage = signal(0);

  currentPage = signal(0);
  pageSize = signal(10);
  pageSizeOption = [10, 20, 30];

  priceMax: number | null = null;
  priceMin: number | null = null;
  brandIds: number[] = [];
  search: string = '';
  ngOnInit() {
    this.activeRoute.queryParams.subscribe(params => {
      this.priceMax = +params['priceMax'] || null;
      this.priceMin = +params['priceMin'] || null;
      this.brandIds = params['brandIds'] ? params['brandIds'].split(',').map((id: any) => +id) : [];
      this.search = params['search'] || '';
      this.getAllData();
    });
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

  setPageSize(event: any) {
    this.pageSize.set(parseInt(event.target?.value ?? 0));
    this.getAllData()
  }

  setPage(page: number) {
    this.currentPage.set(page);
    this.getAllData();
  }

  getAllData() {
    const filter: any = {};

    if (this.priceMax !== null) {
      filter.price = { ...filter.price, $lte: this.priceMax };
    }

    if (this.priceMin !== null) {
      filter.price = { ...filter.price, $gte: this.priceMin };
    }

    if (this.brandIds.length > 0) {
      filter.brandId = { $in: this.brandIds };
    }
    this.productApiService.getAll(this.search, {
      pagination: {
        currentPage: this.currentPage(), pageSize: this.pageSize()
      },
      filter
    }).subscribe((res: any) => {
      this.products.set(res.result);
      this.totalProduct.set(res.total ?? 0);
      this.totalPage.set(Math.ceil(this.totalProduct() / this.pageSize()));
    });
  }

}
