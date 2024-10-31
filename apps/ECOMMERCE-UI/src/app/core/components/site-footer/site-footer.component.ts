import { Component } from '@angular/core';
import { AngularModule } from '../../../shared/modules/angular.module';

@Component({
  selector: 'app-site-footer',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss'
})
export class SiteFooterComponent {

}
