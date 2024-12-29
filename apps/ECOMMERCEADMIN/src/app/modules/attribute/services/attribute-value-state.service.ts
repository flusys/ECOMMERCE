import { effect, inject, Injectable } from '@angular/core';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { IAttributeValue } from '../interfaces/attribute-value-data.interface';
import { IAttributeValueStoreState } from '../interfaces/attribute-value-state.interfaces';
import { ɵFormGroupValue } from '@angular/forms';
import { take } from 'rxjs';
import { IAttributeValueForm } from '../interfaces/attribute-value-form.interface';
import { AttributeValueApiService } from './attribute-value-api.service';


const InitValue: IAttributeValueStoreState = {
  data: getInitResponse<IAttributeValue[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['id', 'name', 'attribute'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class AttributeValueStateService extends Store<IAttributeValueStoreState> {
  private attributeApiService = inject(AttributeValueApiService);

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
    this.attributeApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<IAttributeValueForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as IAttributeValue);
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