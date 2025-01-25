import { effect, inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { take } from 'rxjs';
import { IPost } from '../interfaces/post-data.interface';
import { IPostForm } from '../interfaces/post-form.interface';
import { IPostStoreState } from '../interfaces/post-state.interfaces';
import { PostApiService } from './post-api.service';

const dataFarPage = 12;
const InitValue: IPostStoreState = {
  data: getInitResponse<IPost[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['id', 'title', 'image', 'isHtml', 'description', 'category.name', 'category.id'],
  pagination: { pageSize: dataFarPage, currentPage: 0 },

  editModelData: null,
  loading: false,
};


@Injectable({
  providedIn: 'root'
})
export class PostStateService extends Store<IPostStoreState> {
  private postApiService = inject(PostApiService);

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
      this.select('pagination')()
      this.callApi();
    });
  }

  callApi() {
    const select = this.select('select')() ?? undefined;
    const sort = this.select('sort')() ?? undefined;
    const filter = this.select('filter')() ?? undefined;
    const pagination = this.select('pagination')() ?? undefined;
    const body = { select, sort, filter, pagination, withDeleted: this.withDeleted }
    this.setState({ loading: true, });
    this.postApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<IPostForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as IPost);
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