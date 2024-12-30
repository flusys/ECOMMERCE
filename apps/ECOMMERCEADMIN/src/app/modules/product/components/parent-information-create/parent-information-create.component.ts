import { Component, inject, input } from '@angular/core';
import { AngularModule, PrimeModule } from 'flusysng/shared/modules';
import { IParentProductForm } from '../../interfaces/product-form.interface';
import { FormGroup, FormArray } from '@angular/forms';
import { BrandStateService } from '../../../brand/services/brand-state.service';
import { CategoryStateService } from '../../../category/services/category-state.service';
import { CompanyStateService } from '../../../company/services/company-state.service';
import { TagStateService } from '../../../tag/services/tag-state.service';
import { ICategory } from '../../../category/interfaces/category-data.interface';
import { AppTreeCategoryComponent } from '../../../category/components/tree-category.component';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { ProductFormService } from '../../services/product-form.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-parent-information-create',
  imports: [
    PrimeModule,
    AngularModule,
    AppTreeCategoryComponent,
    DialogModule,
    ImageModule,
    MultiSelectModule,
    EditorModule
  ],
  templateUrl: './parent-information-create.component.html',
  styleUrl: './parent-information-create.component.scss',
})
export class ParentInformationCreateComponent {
  parentForm = input.required<FormGroup<IParentProductForm>>();

  brandStateService = inject(BrandStateService);
  categoryStateService = inject(CategoryStateService);
  companyStateService = inject(CompanyStateService);
  tagStateService = inject(TagStateService);

  productFormService = inject(ProductFormService);

  get formValue() {
    return this.parentForm()?.value;
  }

  get BRANDS() {
    return this.brandStateService.select('data')().result;
  }
  get TAGS() {
    return this.tagStateService.select('data')().result;
  }
  get COMPANIES() {
    return this.companyStateService.select('data')().result;
  }
  get CATEGORIES() {
    return this.categoryStateService.categoryTree();
  }

  //Category Section
  selectedCategoryInformation: ICategory | null = null;
  showCategoryTree = false;
  get categoryId(): number {
    return this.parentForm()?.value?.category ?? 0;
  }
  handleItemSelection(value: { item: ICategory, value: boolean }) {
    if (value.value) {
      const parentForm = this.parentForm();
      if (parentForm) {
        this.selectedCategoryInformation= value.item;
        parentForm.patchValue({
          category: value.item.id
        });
      }
    } else {
      const parentForm = this.parentForm();
      this.selectedCategoryInformation= null;
      if (parentForm) {
        parentForm.patchValue({
          category: undefined
        });
      }
    }
  }

  get images(): string[] {
    const images = this.parentForm()?.value?.images;
    return Array.isArray(images) ? images : [];
  }


  //Specification Section
  get specifications() {
    return this.parentForm()?.get('specifications') as FormArray;
  }
  onAddNewSpecifications() {
    const f = this.productFormService.specificationsFormGroup
    this.specifications.push(f);
  }
  removeSpecifications(index: number) {
    this.specifications?.removeAt(index);
  }

}
