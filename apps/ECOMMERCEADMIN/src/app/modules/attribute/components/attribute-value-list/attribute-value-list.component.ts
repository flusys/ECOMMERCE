import { Component, inject } from '@angular/core';
import { LayoutService } from 'flusysng/layout/services';
import { IDeleteData } from 'flusysng/shared/interfaces';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';
import { IAttributeValue } from '../../interfaces/attribute-value-data.interface';
import { AttributeValueApiService } from '../../services/attribute-value-api.service';
import { AttributeValueStateService } from '../../services/attribute-value-state.service';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { IfRowEmptyDirective } from 'flusysng/shared/directives';

@Component({
  selector: 'app-attribute-value-list',
  imports: [
    AngularModule,
    PrimeModule,
    IfRowEmptyDirective,
  ],
  templateUrl: './attribute-value-list.component.html',
  styleUrl: './attribute-value-list.component.scss',
})
export class AttributeValueListComponent {
  attributeValueStateService = inject(AttributeValueStateService);
  attributeValueApiService = inject(AttributeValueApiService);
  layoutService = inject(LayoutService);
  private messageService = inject(MessageService);

  constructor() {
  }

  selectedAttribute: IAttributeValue[] = [];
  globalFilterField: string[] = ['name', 'menu.name'];


  withDeletedItem(type?: number) {
    this.selectedAttribute = [];
    this.attributeValueStateService.withDeleted = !this.attributeValueStateService.withDeleted;
    if (!type) {
      if (this.attributeValueStateService.withDeleted) {
        this.attributeValueStateService.callApi();
      } else {
        this.attributeValueStateService.deleteItemFromList('restore', []);
      }
    }
  }


  getInputString(event: any) {
    return event.target.value;
  }

  editAttribute(attribute: IAttributeValue) {
    this.attributeValueStateService.setState({ editModelData: null });
    this.attributeValueStateService.setState({ editModelData: attribute });
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
      this.attributeValueApiService.delete(deleteData).pipe(take(1)).subscribe((result) => {
        if (result.success) {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Success!', detail: result.message });
          this.attributeValueStateService.deleteItemFromList(type == 'restore' ? 'restore' : 'delete', ids);
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
