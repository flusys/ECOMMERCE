import { Component } from '@angular/core';
import { CompanyListComponent } from '../../modules/company/components/company-list/company-list.component';
import { CompanyCreateComponent } from '../../modules/company/components/company-create/company-create.component';

@Component({
  selector: 'app-company',
  imports: [
    CompanyCreateComponent,
    CompanyListComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent { }
