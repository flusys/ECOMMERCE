import { Component } from '@angular/core';
import {LayoutService} from "flusysng/layout/services";
import { AngularModule } from 'flusysng/shared/modules';

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
