import { computed, effect, inject, Injectable, Signal } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { take } from 'rxjs';
import { ICategory } from '../interfaces/category-data.interface';
import { ICategoryForm } from '../interfaces/category-form.interface';
import { ICategoryStoreState } from '../interfaces/category-state.interfaces';
import { CategoryApiService } from './category-api.service';

const InitValue: ICategoryStoreState = {
  data: getInitResponse<ICategory[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['id', 'name', 'description', 'image', 'parent', 'isPopular'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class CategoryStateService extends Store<ICategoryStoreState> {
  private companyApiService = inject(CategoryApiService);
  categoryTree: Signal<ICategory[]> = computed(() => {
    return this.getCategoryTree(this.getSignalStateValue('data').result);
  });

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

  addOrUpdateDataList(data: ɵFormGroupValue<ICategoryForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as ICategory);
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



  getCategoryTree(value: ICategory[]): ICategory[] {
    const data = [...value].map((item) => { return { ...item } });      // make shallow copy.
    return appendChild(data.filter((item) => (item.parent as ICategory)?.id == 0 || item.parent == null));

    function appendChild(array: ICategory[]): ICategory[] {
      return array.map((p: ICategory) => {
        const children = data.filter((item) => (item.parent as ICategory)?.id == p.id);
        if (children.length) {
          return { ...p, ...{ children: appendChild(children) } }
        } else {
          return p
        }
      })
    }
  }
}