import { effect, inject, Injectable } from '@angular/core';
import { ɵFormGroupValue } from '@angular/forms';
import { getInitResponse, Store } from 'flusysng/shared/classes';
import { take } from 'rxjs';
import { IFolder } from '../interfaces/folder-data.interface';
import { IFolderForm } from '../interfaces/folder-form.interface';
import { IFolderStoreState } from '../interfaces/folder-state.interfaces';
import { FolderApiService } from './folder-api.service';

const InitValue: IFolderStoreState = {
  data: getInitResponse<IFolder[]>([]),

  filter: null,
  sort: { serial: 'ASC' },
  select: ['id', 'name', 'serial'],

  editModelData: null,
  loading: false,
};

@Injectable({
  providedIn: 'root'
})
export class FolderStateService extends Store<IFolderStoreState> {
  private folderApiService = inject(FolderApiService);


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
    this.folderApiService.getAll('', body).pipe(take(1)).subscribe(res => {
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

  addOrUpdateDataList(data: ɵFormGroupValue<IFolderForm>) {
    let stateValue = this.select('data')();
    let result = stateValue.result;

    if (data.id) {
      let item = result.find((item) => item.id == data.id)
      if (item) {
        result = result.map((item) => item.id == data.id ? { ...item, ...data } : item)
      } else {
        result.push(data as IFolder);
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
