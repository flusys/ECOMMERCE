import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalStateService {
  selectedQuickViewProduct = signal<any>(null);
}
