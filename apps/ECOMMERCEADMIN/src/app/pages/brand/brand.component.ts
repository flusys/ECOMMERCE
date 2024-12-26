import { Component } from '@angular/core';
import { BrandListComponent } from '../../modules/brand/components/brand-list/brand-list.component';
import { BrandCreateComponent } from '../../modules/brand/components/brand-create/brand-create.component';

@Component({
  selector: 'app-brand',
  imports: [
    BrandCreateComponent,
    BrandListComponent
  ],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
})
export class BrandComponent {}
