import { effect, inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { take } from 'rxjs';
import { ICompany } from '../interfaces/company-data.interface';
import { ICompanyForm } from '../interfaces/company-form.interface';
import { ICompanyStoreState } from '../interfaces/company-state.interfaces';
import { CompanyApiService } from './company-api.service';

const InitValue: ICompanyStoreState = {
  data: getInitResponse<ICompany[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['_id', 'name', 'address', 'image'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class CompanyStateService extends Store<ICompanyStoreState> {
  private companyApiService = inject(CompanyApiService);
  withDeleted: boolean = false;

  constructor() {
    super(InitValue);

    this.loadData();
  }

  loadData() {
    effect(() => {
      this.select('select')()
      this.select('sort')()
      this.select('filter')()
      this.callApi();
    });
  }

  callApi() {
    const select = this.select('select')() ?? undefined;
    const sort = this.select('sort')() ?? undefined;
    const filter = this.select('filter')() ?? undefined;
    const body = { select, sort, filter, withDeleted: this.withDeleted }
    this.setState({ loading: true, });
    this.companyApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<ICompanyForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as ICompany);
      }
    }
    stateValue = { ...stateValue, ...{ result: result } }
    this.setState({ data: stateValue })
  }

  deleteItemFromList(type: 'delete' | 'restore', ids: number[]) {
    if (type == 'delete') {
      let stateValue = this.select('data')();
      let result = stateValue.result.filter((item) => !ids.includes(item.id));
      stateValue = { ...stateValue, ...{ result: result } }
      this.setState({ data: stateValue })
    } else {
      let stateValue = this.select('data')();
      let result = stateValue.result.map((item) => {
        if (ids.includes(item.id)) {
          return { ...item, ...{ deletedAt: undefined } }
        } else {
          return item;
        }
      }).filter((item) => !item.deletedAt);
      stateValue = { ...stateValue, ...{ result: result } }
      this.setState({ data: stateValue })
    }
  }

}