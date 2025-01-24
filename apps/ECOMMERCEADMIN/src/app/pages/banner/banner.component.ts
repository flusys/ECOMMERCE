import { Component } from '@angular/core';
import { BannerListComponent } from '../../modules/banner/components/banner-list/banner-list.component';
import { BannerCreateComponent } from '../../modules/banner/components/banner-create/banner-create.component';

@Component({
  selector: 'app-banner',
  imports: [
    BannerCreateComponent,
    BannerListComponent
  ],
  templateUrl: './banner.component.html',
})
export class BannerComponent {}
