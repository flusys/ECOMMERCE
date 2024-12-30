import { Component, inject, input, OnInit } from '@angular/core';
import { IProductForm } from '../../interfaces/product-form.interface';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { DialogModule } from 'primeng/dialog';
import { AttributeApiService } from '../../../attribute/services/attribute-api.service';
import { IAttribute } from '../../../attribute/interfaces/attribute-data.interface';
import { IAttributeValue } from '../../../attribute/interfaces/attribute-value-data.interface';
import { ProductFormService } from '../../services/product-form.service';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-child-information-create',
  imports: [
    PrimeModule,
    AngularModule,
    DialogModule,
    ImageModule
  ],
  templateUrl: './child-information-create.component.html',
  styleUrl: './child-information-create.component.scss',
})
export class ChildInformationCreateComponent implements OnInit {
  chieldArrayForm = input.required<FormArray<FormGroup<IProductForm>>>();
  attributeApiService = inject(AttributeApiService);
  productFormService = inject(ProductFormService);
  rootFormGroup = inject(FormGroupDirective);

  attributeList: IAttribute[] = [];
  ngOnInit(): void {
    this.attributeApiService.getAllWithValues().subscribe((res) => {
      if (res.success) {
        this.attributeList = res.result;
      }
    });
  }

  get chieldArrayValue() {
    return this.chieldArrayForm().value;
  }
  onAddNewChild() {
    const f = this.productFormService.productFormGroup;
    this.chieldArrayForm().push(f);
  }
  duplicateChild(index: number) {
    const data = this.chieldArrayValue.at(index);
    const f = this.productFormService.productFormGroup;
    this.chieldArrayForm().push(f);
    this.ingredients(this.chieldArrayForm().length - 1).clear()
    if (data && data.ingredients && data.ingredients.length) {
      data.ingredients.map(ing => {
        const j = this.productFormService.ingredientsFromGroup;
        this.ingredients(this.chieldArrayForm().length - 1).push(j);
      });
    }
  }
  removeChild(index: number) {
    this.chieldArrayForm()?.removeAt(index);
  }

  //Ingredients Manage Start
  ingredients(index: number) {
    return (this.chieldArrayForm().at(index) as FormGroup).controls["ingredients"] as FormArray;
  }
  removeIngredients(parentIndex: number, index: number) {
    this.ingredients(parentIndex)?.removeAt(index);
  }
  onAddNewIngredients(parentIndex: number) {
    const f = this.productFormService.ingredientsFromGroup
    this.ingredients(parentIndex).push(f);
  }
  //Ingredients Manage End


  //Attributes Manage Start
  showGenerateAttributeDialoge = false;
  selectedAttribute: IAttributeValue[] = [];
  submitAttribute() {

  }

  clickAttribute(event: any, attribute: any, child: any) {

  }

  checkSelection(parent: any, child: any): boolean {
    return true;
  }

  resetSelectedAttribute() {
    this.selectedAttribute = []
  }
}
