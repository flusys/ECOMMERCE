import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @ViewChild('collapseMenu') collapseMenu!: ElementRef;

  handleClick() {
    if (this.collapseMenu.nativeElement.style.display === 'block') {
      this.collapseMenu.nativeElement.style.display = 'none';
    } else {
      this.collapseMenu.nativeElement.style.display = 'block';
    }
  }
}
