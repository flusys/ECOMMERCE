import { Component } from '@angular/core';
import { AngularModule } from '@shared/modules/angular.module';
import {LayoutService} from "flusysng/layout/services";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss'
})
export class AppFooterComponent {
  constructor(public layoutService: LayoutService) {
  }
}
