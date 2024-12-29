import { Component } from '@angular/core';
import { AttributeCreateComponent } from '../../modules/attribute/components/attribute-create/attribute-create.component';
import { AttributeListComponent } from '../../modules/attribute/components/attribute-list/attribute-list.component';
import { AttributeValueCreateComponent } from '../../modules/attribute/components/attribute-value-create/attribute-value-create.component';
import { AttributeValueListComponent } from '../../modules/attribute/components/attribute-value-list/attribute-value-list.component';
import { PrimeModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-attribute',
  imports: [
    PrimeModule,
    AttributeCreateComponent,
    AttributeListComponent,
    AttributeValueCreateComponent,
    AttributeValueListComponent
  ],
  templateUrl: './attribute.component.html',
  styleUrl: './attribute.component.scss',
})
export class AttributeComponent {}
