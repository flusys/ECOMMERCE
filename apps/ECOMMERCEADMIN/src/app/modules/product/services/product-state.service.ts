import { effect, inject, Injectable } from '@angular/core';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { IProduct } from '../interfaces/product-data.interface';
import { IProductStoreState } from '../interfaces/product-state.interface';
import { ProductApiService } from './product-api.service';
import { take } from 'rxjs';


const dataFarPage = 12;
const InitValue: IProductStoreState = {
  data: getInitResponse<IProduct[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  pagination: { pageSize: dataFarPage, currentPage: 0 },

  editModelData: null,
  editModelParentData:null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class ProductStateService extends Store<IProductStoreState> {
  private productApiService = inject(ProductApiService);
  withDeleted: boolean = false;
  constructor() {
    super(InitValue);

    this.loadData();
  }


  loadData() {
    effect(() => {
      this.select('sort')()
      this.select('filter')()
      this.select('pagination')()
      this.callApi();
    });
  }


  callApi() {
    const sort = this.select('sort')() ?? undefined;
    const filter = this.select('filter')() ?? undefined;
    const pagination = this.select('pagination')() ?? undefined;
    const body = { sort, filter, pagination, withDeleted: this.withDeleted }
    this.setState({ loading: true, });
    this.productApiService.getAll('', body).pipe(take(1)).subscribe(res => {
      this.setState({ loading: false, });
      if (res.success) {
        this.setState({
          data: res,
        });
      }
    }, (err) => {
      this.setState({ loading: false, });
    });
  }

}
