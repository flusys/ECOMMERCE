import { Component } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent {

}
