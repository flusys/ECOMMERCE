import { Component, OnInit } from '@angular/core';
import { PrimeModule, AngularModule } from 'flusysng/shared/modules';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [PrimeModule, AngularModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
