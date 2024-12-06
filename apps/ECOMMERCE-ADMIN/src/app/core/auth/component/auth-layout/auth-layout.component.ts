import {Component, OnInit} from '@angular/core';
import { AngularModule } from '@shared/modules/angular.module';
import { PrimeModule } from '@shared/modules/prime.module';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    PrimeModule,
    AngularModule
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent implements OnInit {
   optionItems = [
      {label: 'Login', routerLink: 'login'},
      {label: 'Registration', routerLink: 'registration'},
    ];
  ngOnInit() {
  }
}
