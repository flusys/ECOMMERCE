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
import e from 'express';

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
  showGenerateAttributeDialog = false;
  selectedAttributeIds: number[] = [];
  selectionType: string = 'single'
  selectionIndex: number | undefined;

  generateVariant(type: string, index?: number) {
    this.showGenerateAttributeDialog = true;
    this.selectionType = type;
    this.selectionIndex = index;
    if (type == 'single' && index != undefined) {
      if (this.chieldArrayForm().at(index).value.variants?.length) {
        this.selectedAttributeIds = this.chieldArrayForm().at(index).value.variants ?? [];
        this.chieldArrayForm().at(index).patchValue({
          variants: []
        })
      }
    }
  }

  submitAttribute() {
    if (this.selectionIndex != undefined) {
      this.chieldArrayForm().at(this.selectionIndex).patchValue({
        variants: this.selectedAttributeIds
      });
    }
    this.showGenerateAttributeDialog = false;
    this.resetSelectedAttribute()
  }

  clickAttribute(event: any, attribute: IAttribute, child: IAttributeValue) {
    if (event.target.checked)
      this.selectedAttributeIds.push(child.id);
    else
      this.selectedAttributeIds = this.selectedAttributeIds.filter(item => item != child.id);
  }

  checkSelection(child: any): boolean {
    return this.selectedAttributeIds.find((item) => item == child) ? true : false;
  }

  resetSelectedAttribute() {
    this.selectedAttributeIds = []
  }

  getSelectedVariantsName(variantsIds:number[]|undefined){
    if(variantsIds){
      let result="";
      this.attributeList.forEach((item)=>{
        if(item.values){
          item.values.forEach((value)=>{
            if(variantsIds.includes(value.id)){
              result+=item.name+":"+value.name+",";
            }
          })
        }
      })
      return result.replace(/,$/, "");
    }
    return "";
  }
}
