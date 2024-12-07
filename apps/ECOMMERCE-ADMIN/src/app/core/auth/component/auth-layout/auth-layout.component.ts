import {Component, OnInit} from '@angular/core';
import { PrimeModule, AngularModule } from 'libs/shared/src';

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
