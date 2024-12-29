import { effect, inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { take } from 'rxjs';
import { ITag } from '../interfaces/tag-data.interface';
import { ITagForm } from '../interfaces/tag-form.interface';
import { ITagStoreState } from '../interfaces/tag-state.interfaces';
import { TagApiService } from './tag-api.service';

const InitValue: ITagStoreState = {
  data: getInitResponse<ITag[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['id', 'name', 'priority', 'image'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class TagStateService extends Store<ITagStoreState> {
  private tagApiService = inject(TagApiService);


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
    this.tagApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<ITagForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as ITag);
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