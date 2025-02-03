import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  loginUserData = signal<any>(null);
  constructor() {
  }
}
