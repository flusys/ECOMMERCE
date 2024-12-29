import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IAttribute } from '../../interfaces/attribute-data.interface';
import { AttributeApiService } from '../../services/attribute-api.service';
import { AttributeStateService } from '../../services/attribute-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-attribute-list',
  imports: [
    AngularModule,
    PrimeModule,
  ],
  templateUrl: './attribute-list.component.html',
  styleUrl: './attribute-list.component.scss',
})
export class AttributeListComponent {
  attributeStateService = inject(AttributeStateService);
  attributeApiService = inject(AttributeApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedAttribute: IAttribute[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedAttribute = [];
    this.attributeStateService.withDeleted = !this.attributeStateService.withDeleted;
    if (!type) {
      if (this.attributeStateService.withDeleted) {
        this.attributeStateService.callApi();
      } else {
        this.attributeStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editAttribute(attribute: IAttribute) {
    this.attributeStateService.setState({ editModelData: null });
    this.attributeStateService.setState({ editModelData: attribute });
  }

  deleteOrRestore(type: string) {
    if (this.selectedAttribute.length) {
      let ids: number[] = [];
      if (type == 'restore') {
        ids = this.selectedAttribute.filter((item) => item.deletedAt).map((item) => item.id);
      } else {
        ids = this.selectedAttribute.filter((item) => !item.deletedAt).map((item) => item.id);
      }

      if (!ids.length) return;
      const deleteData: IDeleteData = {
        id: ids,
        type: type == 'restore' ? 'restore' : 'delete'
      }
      this.attributeApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.attributeStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
          if (type == 'restore')
            this.withDeletedItem(1);
          this.clearAll()
        } else {
          this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Sorry!', detail: result.message });
        }
      }, (err) => {
        this.messageService.add({
          key: 'tst',
          severity: 'warn',
          summary: 'Sorry!',
          detail: Array.isArray(err.error.message) ? err.error.message[0] : err.error.message
        });
      })
    } else {
      this.messageService.add({
        key: 'tst',
        severity: 'error',
        summary: 'Sorry!',
        detail: "Need to Select attribute first!"
      });
    }
  }


  clearAll() {
    this.selectedAttribute = []
  }
}
