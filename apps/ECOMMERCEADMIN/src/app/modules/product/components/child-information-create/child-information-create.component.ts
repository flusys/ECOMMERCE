import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProductForm } from '../../interfaces/product-form.interface';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-child-information-create',
  imports: [CommonModule],
  templateUrl: './child-information-create.component.html',
  styleUrl: './child-information-create.component.scss',
})
export class ChildInformationCreateComponent {
  chieldArrayForm = input<FormArray<FormGroup<IProductForm>>>();
}
