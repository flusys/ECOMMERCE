import { Component } from '@angular/core';
import { AngularModule } from '../../shared/modules/angular.module';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    AngularModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

}
